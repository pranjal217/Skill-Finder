import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer"; // NEW: used only by the contact form
import { GoogleGenAI } from "@google/genai";
import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Models are tried in order. Free-tier limits apply per model, so if one is
// rate limited or overloaded, the next one is tried.
// To change the list without editing code, set GEMINI_MODELS in .env.local,
// for example: GEMINI_MODELS=gemini-3.5-flash-lite,gemini-3.6-flash
const MODELS = (
  process.env.GEMINI_MODELS ||
  "gemini-3.6-flash,gemini-3.5-flash-lite,gemini-3.8-flash"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

// Set MOCK_ANALYSIS=true in .env.local to skip Gemini and return a sample
// result (the resume file is still read and checked). Never set this in production.
const MOCK_MODE = process.env.MOCK_ANALYSIS === "true";

const MOCK_RESULT = {
  covered_skills: ["React", "JavaScript", "Python", "REST APIs", "SQL", "Git", "Figma"],
  must_have_gaps: ["TypeScript", "PostgreSQL", "FastAPI", "Automated testing"],
  nice_to_have_gaps: ["Docker", "AWS", "CI/CD", "Agile"],
  career_matches: [
    {
      role: "Frontend Developer (Junior)",
      fit_percent: 82,
      why: "Strong React and JavaScript experience shown in projects, plus Figma for UI work.",
      skills_to_add: [
        { skill: "TypeScript", priority: "must_have" },
        { skill: "Jest", priority: "nice_to_have" },
      ],
    },
    {
      role: "UI/UX Developer",
      fit_percent: 74,
      why: "Combines Figma design skills with React implementation.",
      skills_to_add: [
        { skill: "Accessibility (WCAG)", priority: "must_have" },
        { skill: "Design systems", priority: "nice_to_have" },
      ],
    },
    {
      role: "Full Stack Developer (Intern)",
      fit_percent: 61,
      why: "Has frontend, Python and SQL exposure, but limited backend project evidence.",
      skills_to_add: [
        { skill: "Node.js", priority: "must_have" },
        { skill: "PostgreSQL", priority: "must_have" },
        { skill: "Docker", priority: "nice_to_have" },
      ],
    },
    {
      role: "Data Analyst (Junior)",
      fit_percent: 55,
      why: "Python and SQL are present, but no analysis or visualization projects are shown.",
      skills_to_add: [
        { skill: "Pandas", priority: "must_have" },
        { skill: "Power BI or Tableau", priority: "must_have" },
        { skill: "Statistics", priority: "nice_to_have" },
      ],
    },
  ],
};

const responseFormat = [
  {
    type: "text",
    mime_type: "application/json",
    schema: {
      type: "object",
      properties: {
        total_skills: { type: "integer" },
        matched_skills_count: { type: "integer" },
        must_have_gaps: { type: "array", items: { type: "string" } },
        nice_to_have_gaps: { type: "array", items: { type: "string" } },
        covered_skills: { type: "array", items: { type: "string" } },
        career_matches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string" },
              fit_percent: { type: "integer" },
              why: { type: "string" },
              skills_to_add: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    skill: { type: "string" },
                    priority: { type: "string", enum: ["must_have", "nice_to_have"] },
                  },
                  required: ["skill", "priority"],
                },
              },
            },
            required: ["role", "fit_percent", "why", "skills_to_add"],
          },
        },
      },
      required: [
        "total_skills",
        "matched_skills_count",
        "must_have_gaps",
        "nice_to_have_gaps",
        "covered_skills",
        "career_matches",
      ],
    },
  },
];

const isOverloaded = (e) =>
  e?.status === 503 ||
  e?.code === "service_unavailable" ||
  String(e?.message || "").includes("high demand");

const isRateLimited = (e) =>
  e?.status === 429 ||
  e?.code === "too_many_requests" ||
  String(e?.message || "").includes("Rate limit") ||
  String(e?.message || "").includes("429");

function cleanCareerMatches(matches) {
  if (!Array.isArray(matches)) return [];
  return matches
    .filter((m) => m && typeof m.role === "string" && m.role.trim())
    .map((m) => ({
      role: m.role.trim(),
      // Keep the fit between 0 and 100 even if the model returns something odd
      fit_percent: Math.max(0, Math.min(100, Math.round(Number(m.fit_percent) || 0))),
      why: typeof m.why === "string" ? m.why.trim() : "",
      skills_to_add: (Array.isArray(m.skills_to_add) ? m.skills_to_add : [])
        .filter((s) => s && typeof s.skill === "string" && s.skill.trim())
        .map((s) => ({
          skill: s.skill.trim(),
          priority: s.priority === "must_have" ? "must_have" : "nice_to_have",
        })),
    }))
    .sort((a, b) => b.fit_percent - a.fit_percent)
    .slice(0, 5);
}

function withCounts(analysis) {
  // Compute the counts from the lists instead of trusting the model's numbers
  analysis.matched_skills_count = analysis.covered_skills.length;
  analysis.total_skills =
    analysis.covered_skills.length +
    analysis.must_have_gaps.length +
    analysis.nice_to_have_gaps.length;
  analysis.career_matches = cleanCareerMatches(analysis.career_matches);
  return analysis;
}

async function createWithFallback(prompt) {
  let lastError;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[analyse] calling ${model} (attempt ${attempt + 1})`);
        return await ai.interactions.create({
          model,
          input: prompt,
          response_format: responseFormat,
        });
      } catch (e) {
        lastError = e;
        console.warn(`[analyse] ${model} failed:`, e?.message || e);
        // Rate limited on this model: move straight to the next model
        if (isRateLimited(e)) break;
        // Anything other than overload is a real error: stop here
        if (!isOverloaded(e)) throw e;
        // Overloaded: wait briefly and retry once
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

async function runAnalysis(prompt) {
  const interaction = await createWithFallback(prompt);
  return withCounts(JSON.parse(interaction.output_text));
}

// Identical resume + job description reuse the same result instead of
// spending another API request (also covers duplicate calls and re-analyse).
const cache = new Map();

function cacheKey(jobDescription, resumeText) {
  return crypto
    .createHash("sha256")
    .update(`${jobDescription}\n---\n${resumeText}`)
    .digest("hex");
}

/* ------------------------------------------------------------------ */
/* NEW: contact form handler                                           */
/* The contact page sends JSON, the resume upload sends a file         */
/* (multipart), so POST below uses the content type to tell them apart. */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleContact(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const honeypot = String(body.website || "");

  // Bots fill the hidden field. Pretend it worked and send nothing.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (name.length > 100 || email.length > 200 || message.length > 3000) {
    return NextResponse.json({ error: "Your message is too long." }, { status: 400 });
  }

  const { SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("[contact] SMTP_USER / SMTP_PASS are not set.");
    return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SMTP_USER, pass: SMTP_PASS }, // Gmail App Password, not your normal password
    });

    await transporter.sendMail({
      from: `"Skill Match Contact" <${SMTP_USER}>`,
      to: CONTACT_TO || SMTP_USER,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`, // Reply goes to the visitor
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // NEW: contact form requests are JSON, resume uploads are multipart
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await handleContact(request);
    }

    const formData = await request.formData();
    const file = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resume or job description." },
        { status: 400 }
      );
    }

    let resumeText = "";

    if (file.type === "application/pdf") {
      const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
      const { text } = await extractText(pdf, { mergePages: true });
      resumeText = text;
    } else if (file.type === "text/plain") {
      resumeText = await file.text();
    } else {
      return NextResponse.json(
        { error: "Please upload a PDF or TXT file." },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Couldn't read text from this file. Try a text-based PDF or a .txt file.",
        },
        { status: 422 }
      );
    }

    // Test mode: return a sample result without calling Gemini
    if (MOCK_MODE) {
      console.log("[analyse] MOCK_ANALYSIS is on, returning sample result");
      return NextResponse.json(withCounts(structuredClone(MOCK_RESULT)), {
        status: 200,
      });
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) and career coach.
You have two tasks: (A) compare the resume to the job description, and (B) suggest other roles the candidate could apply for.

TASK A: Skill matches and gaps
Rules:
1. List only skills, tools, or technologies explicitly named in the job description.
2. covered_skills: skills from the job description that the resume clearly shows (in the skills section, experience, or projects).
3. must_have_gaps: required skills that the resume does not show. Do not count a related skill as a match (for example, MySQL is not PostgreSQL, and Flask is not FastAPI).
4. nice_to_have_gaps: skills the posting lists as preferred or nice to have that the resume does not show.
5. Every skill appears in exactly one list. Use short names like "TypeScript", not sentences.

TASK B: Career matches (career_matches)
Suggest 4 to 5 job roles this candidate could realistically apply for, based only on what the resume shows.
Rules:
1. Base every role on evidence in the resume (skills, projects, experience, education). Do not suggest roles the resume gives no support for.
2. Match the candidate's seniority. If the resume shows little or no work experience, suggest internship, trainee, and junior roles, plus at most one stretch role.
3. Do not repeat the job title from the job description. That role is already covered by Task A.
4. role: a standard, commonly used job title.
5. fit_percent: an integer from 0 to 100 for how ready the candidate is for that role today.
6. why: one short sentence naming the specific resume evidence behind the match.
7. skills_to_add: the skills the candidate should add to their resume for that role, which the resume does not already show. Use short names like "Docker". Mark each as must_have (needed to be considered for the role) or nice_to_have (strengthens the application). Give 2 to 5 skills per role.
8. Name only skills, tools, and technologies. Do not name specific courses, certifications, platforms, or URLs.
9. Order the roles from highest to lowest fit_percent.

Return only the JSON object described by the schema.

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

    const key = cacheKey(String(jobDescription), resumeText);

    if (!cache.has(key)) {
      const promise = runAnalysis(prompt).catch((err) => {
        cache.delete(key); // never cache failures
        throw err;
      });
      cache.set(key, promise);
      if (cache.size > 50) cache.delete(cache.keys().next().value);
    } else {
      console.log("[analyse] served from cache");
    }

    const analysis = structuredClone(await cache.get(key));
    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("Error analyzing resume:", error);

    if (isRateLimited(error)) {
      return NextResponse.json(
        { error: "Too many requests right now. Please wait a while and try again." },
        { status: 429 }
      );
    }

    if (isOverloaded(error)) {
      return NextResponse.json(
        { error: "The AI service is busy right now. Please try again in a few minutes." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}