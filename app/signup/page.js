"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AuthPanel from "../../components/auth/AuthPanel";

const MARKETING_LINKS = [
  { label: "HOME", href: "/" },
  { label: "HOW IT WORKS", href: "/#how-it-works" },
  { label: "WHY US?", href: "/#why-skill-match" },
  { label: "TRY IT NOW!", href: "/try" },
  { label: "CONTACT", href: "/contact" },
];

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your auth backend (e.g. POST /api/signup) once it exists.
  };

  return (
    <div className="min-h-screen bg-[#0A1930] flex flex-col">
      <Navbar links={MARKETING_LINKS} />

      <main className="flex-1 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto w-full px-4 py-16">
        <AuthPanel />

        <div className="bg-[#EAEAEA] rounded-3xl p-8 md:p-10">
          <h2 className="text-3xl font-black text-[#0A1930]">Sign-up</h2>
          <p className="mt-2 text-sm text-[#4B4B4B]">Pick up where you left off with your gap analyses.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0A1930] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#0A1930]/40 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:border-[#0A1930]"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-semibold text-[#0A1930]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#4B4B4B] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#0A1930]/40 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:border-[#0A1930]"
                required
              />
            </div>

            <p className="text-center text-sm text-[#4B4B4B]">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-[#0A1930] hover:underline">
                Sign-in
              </Link>
            </p>

            <button
              type="submit"
              className="w-full bg-[#D4ED31] text-[#0A1930] font-black py-3 rounded-lg hover:bg-[#bacc22] transition-colors"
            >
              Sign-up
            </button>

            <div className="text-center text-xs text-[#4B4B4B]">or</div>

            <button
              type="button"
              onClick={() => {
                // TODO: wire up Google OAuth
              }}
              className="w-full border border-[#0A1930]/30 rounded-lg py-3 flex items-center justify-center gap-3 font-semibold text-[#0A1930] hover:bg-white transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </div>
      </main>

      <Footer links={MARKETING_LINKS} />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 009 18z"
      />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.9A9 9 0 000 9c0 1.45.35 2.83.9 4.03l3.05-2.33z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.9 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
