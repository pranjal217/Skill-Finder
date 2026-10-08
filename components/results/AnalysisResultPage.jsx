"use client";

import { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './ResultsScreen';

const APP_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'CONTACT', href: '/contact' },
];

/**
 * Adapts the raw response from /api/analyse into the shape ResultsScreen
 * expects. Matches the route.js schema:
 *   { total_skills, matched_skills_count, must_have_gaps: [string],
 *     nice_to_have_gaps: [string], covered_skills: [string],
 *     career_matches: [{ role, fit_percent, why,
 *                        skills_to_add: [{ skill, priority }] }] }
 *
 * The gap arrays are plain skill-name strings (no per-skill severity/
 * reasoning yet), so they're wrapped as { skill } objects — ResultsScreen
 * already renders actionType/reasoning only when present, so this is safe
 * to extend later without touching ResultsScreen.
 */
export function parseGeminiResponse(raw) {
  const mustHave = raw.must_have_gaps ?? [];
  const niceToHave = raw.nice_to_have_gaps ?? [];
  const covered = raw.covered_skills ?? [];
  const totalSkills = raw.total_skills ?? mustHave.length + niceToHave.length + covered.length;
  const matchedCount = raw.matched_skills_count ?? covered.length;

  // Job role suggestions. This was being dropped before, so the results
  // screen never received them.
  const careerMatches = (Array.isArray(raw.career_matches) ? raw.career_matches : [])
    .filter((m) => m && m.role)
    .map((m) => ({
      role: m.role,
      fitPercent: m.fit_percent,
      why: m.why ?? '',
      skillsToAdd: Array.isArray(m.skills_to_add) ? m.skills_to_add : [],
    }));

  return {
    totalSkills,
    matchedCount,
    mustHave: mustHave.map((skill) => ({ skill })),
    niceToHave: niceToHave.map((skill) => ({ skill })),
    covered,
    careerMatches,
  };
}

/**
 * runAnalysis: () => Promise<rawGeminiResponse>
 *   Called on mount and again on "Re-Analyze". Wire this to whatever kicks
 *   off your backend call (e.g. POST /analyze) and resolves with the raw
 *   Gemini JSON.
 * onDownloadReport: (analysis) => void
 *   Called with the parsed analysis when "Download Report" is clicked.
 */
export default function AnalysisResultPage({ runAnalysis, onDownloadReport }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const start = () => {
    setStatus('loading');
    setError(null);
    runAnalysis()
      .then((raw) => {
        setAnalysis(parseGeminiResponse(raw));
        setStatus('ready');
      })
      .catch((err) => {
        setError(err?.message ?? 'Something went wrong while analyzing.');
        setStatus('error');
      });
  };

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1930] flex flex-col">
      <Navbar links={APP_LINKS} />
      <main className="flex-1 px-4 py-10 sm:py-14">
        {status === 'error' ? (
          <ErrorState message={error} onRetry={start} />
        ) : status === 'ready' ? (
          <ResultsScreen analysis={analysis} onDownloadReport={onDownloadReport} onReAnalyze={start} />
        ) : (
          <LoadingScreen />
        )}
      </main>
      <Footer links={APP_LINKS} />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[32px] bg-[#EAEAEA] px-8 py-12 max-w-xl mx-auto text-center">
      <h1 className="font-serif text-2xl text-[#0A1930]">We couldn&apos;t finish the analysis.</h1>
      <p className="mt-2 text-sm text-[#6B6B6B]">{message}</p>
      <button onClick={onRetry} className="mt-6 rounded-full bg-[#D4ED31] px-6 py-3 text-sm font-semibold text-[#0A1930]">
        Try again
      </button>
    </div>
  );
}
