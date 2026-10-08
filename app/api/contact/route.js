import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Reads your Gmail address and app password from .env.local.
// Several common variable names are accepted, so your existing ones should work.
const pick = (...names) => {
  for (const n of names) if (process.env[n]) return process.env[n];
  return "";
};

const MAIL_USER = pick(
  "EMAIL_USER", "GMAIL_USER", "GMAIL_ID", "EMAIL_ID", "GMAIL", "EMAIL", "MAIL_USER"
);
const MAIL_PASS = pick(
  "EMAIL_PASS", "EMAIL_PASSWORD", "GMAIL_PASS", "GMAIL_PASSWORD",
  "GMAIL_APP_PASSWORD", "APP_PASSWORD", "MAIL_PASS"
).replace(/\s+/g, ""); // Google shows app passwords with spaces; remove them

// Where messages are delivered. Defaults to your own Gmail.
const MAIL_TO = pick("CONTACT_TO", "EMAIL_TO") || MAIL_USER;

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(request) {
  try {
    if (!MAIL_USER || !MAIL_PASS) {
      console.error(
        "[contact] Missing email settings. Found user:",
        Boolean(MAIL_USER),
        "pass:",
        Boolean(MAIL_PASS)
      );
      return NextResponse.json(
        { error: "Email is not set up on the server yet." },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Honeypot: real visitors never fill this hidden field, bots do.
    if (body?.website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in your name, email and message." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "That message is too long." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: MAIL_USER, pass: MAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Skill Match Contact" <${MAIL_USER}>`,
      to: MAIL_TO,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`, // hitting Reply goes to the visitor
      subject: `Skill Match message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New message from Skill Match</h3>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[contact] send failed:", error);

    if (error?.code === "EAUTH") {
      return NextResponse.json(
        { error: "Gmail rejected the login. Check the Gmail address and app password." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't send your message. Please try again." },
      { status: 500 }
    );
  }
}