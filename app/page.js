import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


const MARKETING_LINKS = [
  { label: "HOME", href: "/" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "WHY US?", href: "#why-skill-match" },
  { label: "TRY IT NOW!", href: "/try" },
  { label: "CONTACT", href: "/contact" },
];

export default function Landing() {
  return (
    <div className="z-10 min-h-screen bg-[#0d234f] text-white flex flex-col">
      <Navbar links={MARKETING_LINKS} />

      {/* Hero */}
      <section className=" relative overflow-hidden px-4 pt-20 pb-24 text-center">
        <Decorations />
        <p className="text-xs tracking-[0.3em] text-white/60 mb-4">RESUME V/S JOB POSTING</p>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight max-w-2xl mx-auto">
          The skills you have.
          <br />
          The skills they want.
          <br />
          The difference, in one screen.
        </h1>
        <p className="mt-6 text-white/70 max-w-md mx-auto text-sm">
          Upload both. Get a clear list of the skills standing between you and the offer.
        </p>
        <Link
          href="/try"
          className="inline-block mt-8 bg-[#D4ED31] text-[#0A1930] font-black text-sm tracking-widest py-4 px-10 rounded-xl hover:bg-[#bacc22] transition-colors"
        >
          FIND MY GAPS!
        </Link>
      </section>

      {/* Why you're not getting callbacks */}
      
      <section className="relative bg-[#0A1930] px-10 py-30 w-full mx-center text-center overflow-hidden">
        <GlowBlob className="right-10 top-1/3 bg-[#F0704A]" />
        <h2 className="font-serif text-2xl md:text-4xl">Know exactly why you're not getting callbacks</h2>
        <p className="mt-4 text-xl text-white/70 max-w-xl mx-auto">
          Skill Match reads your resume the way an ATS does, lines it up against the job you want, and
          tells you what's missing before a recruiter ever sees the gap.
        </p>
        <div className="relative mt-15 max-w-5xl mx-auto grid sm:grid-cols-3 gap-4 text-left ">
          <FeatureCard icon="!" title="Missing skills" description="Named, not just scored" />
          <FeatureCard icon="+" title="Matching skills" description="See what already lines up" />
          <FeatureCard icon="#" title="Priority order" description="Fix what matters most first" />
        </div>
      </section>
       
      {/* How it works */}
      <section id="how-it-works" className="bg-[#0d234f]  py-16">
        <h2 className="text-center font-black tracking-widest text-xl mb-12">HOW DOES IT WORK?</h2>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-10 items-center">
          <div className="w-100 h-110 rounded-2xl bg-white/10 shrink-0" aria-hidden="true" />
          <ol className=" space-y-8 ">
            <Step
              number="1"
              title="Upload your resume."
              description="Drop in a PDF or DOCX. No formatting needed — Skill Match reads it as-is."
            />
            <Step
              number="2"
              title="Paste the job posting"
              description="Add the job description you're applying to. The more specific, the better the match."
            />
            <Step
              number="3"
              title="See what's missing"
              description="Get a breakdown of matched and missing skills, ranked by how much each one matters."
            />
          </ol>
        </div>
        <div className="text-center mt-10">
          <Link
            href="/try"
            className="inline-block bg-[#D4ED31] text-[#0A1930] font-black text-sm tracking-widest py-4 px-10 rounded-xl hover:bg-[#bacc22] transition-colors"
          >
            FIND MY GAPS!
          </Link>
        </div>
      </section>

      {/* Who is this for */}
      <section className="relative px-10 py-30 bg-[#0A1930]  w-full mx-auto">
        <GlowBlob className="-left-32 top-10 bg-[#0A1930]" />
        <GlowBlob className="-right-32 bottom-10 bg-[#F0704A]" />
        <p className="text-center text-xs tracking-widest text-white/50 mb-2">FOR EVERY KIND OF APPLICANT</p>
        <h2 className="text-center font-black tracking-widest text-xl mb-12">WHO IS THIS FOR?</h2>
        <div className="relative grid gap-5 md:grid-cols-3">
          <WhoRow
            number="01"
            accent="#F0704A"
            icon={<SwitchIcon />}
            title="Career switchers"
            description="Moving into a new field means your resume won't naturally speak the industry's language yet. Skill Match shows you which skills to translate or add so you're not filtered out before you get a chance to explain yourself."
          />
          <WhoRow
            number="02"
            accent="#4FD1C5"
            icon={<GradCapIcon />}
            title="New grads"
            description="Limited experience doesn't mean limited fit. Skill Match highlights the skills you already have — from coursework, projects, or internships — that actually match what the job is asking for."
          />
          <WhoRow
            number="03"
            accent="#D4ED31"
            icon={<StackIcon />}
            title="Job seekers applying at scale"
            description="When you're sending out dozens of applications, you can't manually tailor every resume. Skill Match tells you fast what to fix for each posting, so quantity doesn't come at the cost of quality."
          />
        </div>
      </section>

      {/* Why Skill Match */}
      <section id="why-skill-match" className="relative bg-[#0d234f] px-4 py-30 text-center overflow-hidden">
        
        <h2 className="font-black tracking-widest text-xl">WHY SKILL MATCH?</h2>
        <p className="text-xs tracking-widest text-white/50 mt-2">NOT ANOTHER RESUME GRADER</p>
        <div className="relative mt-10 w-full  px-10 grid sm:grid-cols-3 gap-4 text-left">
          <FeatureCard
            icon="1"
            title="Built for the job, not a template"
            description="Compares your resume against the actual posting — not a generic scoring model."
          />
          <FeatureCard
            icon="2"
            title="Specific gaps, not vague scores"
            description="Names the exact skills missing, not just a percentage."
          />
          <FeatureCard
            icon="3"
            title="Priority, not a keyword dump"
            description="Ranks what's missing by how much it matters, so you know what to fix first."
          />
        </div>
        <Link
          href="/try"
          className="inline-block mt-10 bg-[#D4ED31] text-[#0A1930] font-black text-sm tracking-widest py-4 px-10 rounded-xl hover:bg-[#bacc22] transition-colors"
        >
          FIND MY GAPS!
        </Link>
      </section>

      <Footer links={MARKETING_LINKS} />
    </div>
  );
}

function Decorations() {
  // Loose stand-ins for the scattered orange/green circles in the mockup.
  return (
    <>
    
      <span className=" absolute bottom-[-50] left-[-30] w-70 h-70 rounded-full bg-[#f15424]" aria-hidden="true" />
      <span className="absolute top-14 left-64 w-20 h-20 rounded-full bg-[#3FA34D]" aria-hidden="true" />
      <span className="absolute top-80 left-10 w-15 h-15 rounded-full bg-[#3FA34D]" aria-hidden="true" />
      <span className="absolute bottom-10 left-100 w-20 h-20 rounded-full bg-[#3FA34D]" aria-hidden="true" />
       <span className="absolute top-6 left-7 w-10 h-10 rounded-full bg-[#3FA34D]" aria-hidden="true" />
       <span className="absolute bottom-60 left-90 w-10 h-10 rounded-full bg-[#3FA34D]" aria-hidden="true" />
    {/* right */}
      <span className="absolute top-[-60] right-[-20] w-70 h-70 rounded-full bg-[#0ea93a]" aria-hidden="true" />
      <span className="absolute bottom-60 right-5 w-20 h-20 rounded-full bg-[#f15424]" aria-hidden="true" />
      <span className="absolute bottom-10 right-70 w-25 h-25 rounded-full bg-[#f15424]" aria-hidden="true" />
      <span className="absolute top-10 right-85 w-15 h-15 rounded-full bg-[#f15424]" aria-hidden="true" />
       <span className="absolute bottom-70 right-90 w-10 h-10 rounded-full bg-[#f15424]" aria-hidden="true" />
       <span className="absolute bottom-100 right-50 w-10 h-10 rounded-full bg-[#f15424]" aria-hidden="true" />
       
      
      
    

    
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/5 rounded-2xl p-5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4ED31] text-[#0A1930] font-black text-sm mb-4">
        {icon}
      </span>
      <h3 className="font-semibold text-2xl">{title}</h3>
      <p className="mt-1 text-base text-white/60">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <li className="flex gap-4">
      <span className="font-serif text-white/40 text-2xl leading-none">{number}</span>
      <div>
        <h3 className="font-semibold text-2xl">{title}</h3>
        <p className="mt-1 text-xl text-white/60 ">{description}</p>
      </div>
    </li>
  );
}

function WhoRow({ number, accent, icon, title, description }) {
  return (
    <div className="relative bg-white/5 hover:bg-white/[0.08] transition-colors rounded-2xl p-6 border border-white/5">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-3 mb-2">
        
      <h3 className="font-semibold text-xl">{title}</h3>
      </div>
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}

// Soft blurred glow used to fill otherwise-flat background space on wide
// screens. Pass a Tailwind bg-color class plus positioning classes.
function GlowBlob({ className }) {
  return (
    <span
      className={`pointer-events-none absolute w-72 h-72 rounded-full opacity-[0.12] blur-3xl ${className}`}
      aria-hidden="true"
    />
  );
}

function SwitchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h13l-3-3m3 3l-3 3M20 17H7l3 3m-3-3l3-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GradCapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4L2 9l10 5 10-5-10-5zM6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5M22 9v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}