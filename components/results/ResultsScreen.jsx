"use client";

import { useState } from 'react';
import ProgressRing from './Ring';
import { findSkillAdvice } from './skillTips';

export default function ResultsScreen({ analysis, onDownloadReport, onReAnalyze }) {
  const { totalSkills, matchedCount, covered } = analysis;
  const gapCount = Math.max(totalSkills - matchedCount, 0);
  const careerMatches = normalizeCareerMatches(analysis.careerMatches ?? analysis.career_matches);

  // Every missing skill gets its own action type + a "how to achieve it" suggestion.
  const mustHave = withSuggestions(analysis.mustHave);
  const niceToHave = withSuggestions(analysis.niceToHave);

  return (
    // Full-width on desktop with only a small gutter; stacks into one column on mobile
    <div className="w-full max-w-[1500px] mx-auto px-3 sm:px-4">
      <div className="rounded-[24px] bg-[#EAEAEA] px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-0">
          {/* ---------- Column 1: summary ---------- */}
          <div className="flex flex-col lg:pr-8 lg:sticky lg:top-6 lg:self-start">
            <h1 className="font-serif text-[26px] sm:text-[28px] text-[#0A1930] leading-tight">
              The gaps in your resume, mapped out.
            </h1>

            <div className="mt-6 flex justify-center">
              <ProgressRing
                size={190}
                strokeWidth={24}
                segments={[
                  { value: matchedCount, color: '#1E8E3E' },
                  { value: gapCount, color: '#F0704A' },
                ]}
              >
                <span className="text-2xl font-semibold text-[#0A1930]">
                  {matchedCount}/{totalSkills}
                </span>
                <span className="text-xs text-[#4B4B4B] mt-1">Skills Matched</span>
              </ProgressRing>
            </div>

            {mustHave.length > 0 && (
              <p className="mt-5 text-center text-sm text-[#7A7A7A] max-w-xs mx-auto">
                <span className="font-semibold text-[#0A1930]">
                  {mustHave.length} must-have gap{mustHave.length === 1 ? '' : 's'}
                </span>{' '}
                could keep this resume out of the first cut.
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:flex-col lg:items-stretch">
              <button
                onClick={() => onDownloadReport?.({ ...analysis, mustHave, niceToHave, careerMatches })}
                className="flex items-center justify-center gap-2 rounded-full bg-[#0A1930] border-2 border-[#D4ED31] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1a5c] transition-colors"
              >
                <DownloadIcon /> Download Report
              </button>
              <button
                onClick={onReAnalyze}
                className="flex items-center justify-center gap-2 rounded-full bg-[#D4ED31] border-2 border-[#0A1930] px-6 py-3 text-sm font-semibold text-[#0A1930] hover:bg-[#bacc22] transition-colors"
              >
                <RefreshIcon /> Re-Analyze
              </button>
            </div>
          </div>

          {/* ---------- Column 2: gaps ---------- */}
          <div className="space-y-8 border-t border-[#D5D5D5] pt-8 lg:border-t-0 lg:border-l lg:px-8 lg:pt-0">
            <GapSection title="Must-have gaps" color="#F4552B" items={mustHave} defaultOpen />
            <GapSection title="Nice-to-have gaps" color="#F2A066" items={niceToHave} defaultOpen />
            <CoveredSection skills={covered ?? []} />
          </div>

          {/* ---------- Column 3: career matches ---------- */}
          <div className="border-t border-[#D5D5D5] pt-8 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <CareerMatches matches={careerMatches} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- "How to achieve it" per skill ---------- */

const ACTION_TYPES = ['project', 'practice', 'contribute', 'learn'];

// Last-resort text, only for skills the API gave no suggestion for AND skillTips.js doesn't know.
function genericSuggestion(skill, type) {
  switch (type) {
    case 'practice':
      return `Practise ${skill} on a small real task, then add one resume bullet describing what you did with it.`;
    case 'contribute':
      return `Contribute a small fix or comment to an open-source repo or shared file that uses ${skill}.`;
    case 'learn':
      return `Work through the official ${skill} documentation, then apply it in a small hands-on exercise.`;
    default:
      return `Build a small project that uses ${skill}, put it on GitHub, and add it to your resume.`;
  }
}

// Order of preference for each missing skill:
//   1. the API's own suggestion (written for that exact skill)
//   2. skill-specific advice from skillTips.js
//   3. a generic line
function withSuggestions(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && item.skill)
    .map((item) => {
      const advice = findSkillAdvice(item.skill);

      const rawType = String(item.actionType ?? item.action_type ?? item.type ?? '').toLowerCase();
      const apiType = ACTION_TYPES.includes(rawType) ? rawType : null;
      // A blanket "learn" from the API isn't specific, so prefer the skill's own type when we know it
      const actionType =
        apiType && apiType !== 'learn' ? apiType : advice?.type ?? apiType ?? 'project';

      const apiSuggestion = item.suggestion ?? item.howToAchieve ?? item.how_to_achieve;
      const suggestion = apiSuggestion || advice?.tip || genericSuggestion(item.skill, actionType);

      return { ...item, actionType, suggestion };
    });
}

/* ---------- Career matches ---------- */

// Accepts both the API shape (snake_case) and a camelCase version, so it works
// whichever way the page passes the data in.
function normalizeCareerMatches(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m) => {
      const skills = m.skillsToAdd ?? m.skills_to_add ?? [];
      return {
        role: m.role,
        fit: Math.max(0, Math.min(100, Math.round(Number(m.fitPercent ?? m.fit_percent) || 0))),
        why: m.why || '',
        skillsToAdd: skills
          .map((s) =>
            typeof s === 'string'
              ? { skill: s, priority: 'nice_to_have' }
              : { skill: s.skill, priority: s.priority === 'must_have' ? 'must_have' : 'nice_to_have' }
          )
          .filter((s) => s.skill),
      };
    })
    .filter((m) => m.role);
}

function fitColor(fit) {
  if (fit >= 75) return '#1E8E3E';
  if (fit >= 50) return '#E0925B';
  return '#D14B3A';
}

function CareerMatches({ matches }) {
  return (
    <div>
      <h2 className="font-serif text-[22px] sm:text-[24px] text-[#0A1930] leading-tight">
        Roles you can target.
      </h2>
      <p className="mt-2 text-sm text-[#7A7A7A]">
        Based on what your resume already shows, and the skills to add for each role.
      </p>

      {matches.length === 0 && (
        <p className="mt-5 text-sm text-[#6B6B6B]">
          No role suggestions came back this time. Try Re-Analyze.
        </p>
      )}

      <div className="mt-5 space-y-3">
        {matches.map((match, i) => (
          <RoleCard key={`${match.role}-${i}`} match={match} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}

function RoleCard({ match, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const color = fitColor(match.fit);
  const mustHave = match.skillsToAdd.filter((s) => s.priority === 'must_have');
  const niceToHave = match.skillsToAdd.filter((s) => s.priority !== 'must_have');

  return (
    <div className="rounded-2xl bg-white/70 px-5 py-4">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start justify-between gap-3 text-left">
        <div className="min-w-0">
          <p className="font-semibold text-[#0A1930]">{match.role}</p>
          <p className="mt-0.5 text-xs text-[#7A7A7A]">
            {match.skillsToAdd.length === 0
              ? 'Nothing major to add'
              : `${match.skillsToAdd.length} skill${match.skillsToAdd.length === 1 ? '' : 's'} to add`}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {match.fit}% fit
          </span>
          <span className="text-[#7A7A7A]">
            <Chevron open={open} />
          </span>
        </span>
      </button>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#D5D5D5]">
        <div className="h-full rounded-full" style={{ width: `${match.fit}%`, backgroundColor: color }} />
      </div>

      {open && (
        <div className="mt-4">
          {match.why && <p className="text-sm text-[#6B6B6B]">{match.why}</p>}

          {mustHave.length > 0 && (
            <SkillChips label="Add these first" skills={mustHave} textColor="#D14B3A" />
          )}
          {niceToHave.length > 0 && (
            <SkillChips label="Nice to add" skills={niceToHave} textColor="#B5683A" />
          )}
        </div>
      )}
    </div>
  );
}

function SkillChips({ label, skills, textColor }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: textColor }}>
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s.skill}
            className="rounded-full px-3 py-1 text-sm font-medium text-[#0A1930]"
            style={{ backgroundColor: `${textColor}1F`, border: `1px solid ${textColor}55` }}
          >
            {s.skill}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Gap sections ---------- */

function GapSection({ title, color, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section>
      {/* header: coloured title on the left, count + caret on the right */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[17px] font-semibold" style={{ color }}>
          {title}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#1C1C1C]">
          {items.length}
          <Caret open={open} />
        </span>
      </button>

      {/* divider under the header */}
      <div className="mt-2 h-px w-full bg-[#6B6B6B]/60" />

      {open && items.length > 0 && (
        <ul className="mt-6 space-y-7 pl-1">
          {items.map((item) => (
            <li key={item.skill} className="flex gap-4">
              {/* left accent bar */}
              <div className="w-[3px] shrink-0 rounded-full" style={{ backgroundColor: color }} />

              <div className="py-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif text-[17px] font-bold leading-tight text-[#1C1C1C]">
                    {item.skill}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-[2px] text-[10px] font-semibold leading-none text-white"
                    style={{ backgroundColor: color }}
                  >
                    {item.actionType}
                  </span>
                </div>

                {/* why it's a gap, then how to close it */}
                <p className="mt-2 max-w-[440px] text-[11px] leading-snug text-[#7A7A7A]">
                  {item.reasoning && <>{item.reasoning} </>}
                  <span className="text-[#5A5A5A]">{item.suggestion}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CoveredSection({ skills }) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[17px] font-semibold text-[#1E8E3E]">Skills you&apos;ve already covered</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#1C1C1C]">
          {skills.length}
          <Caret open={open} />
        </span>
      </button>

      <div className="mt-2 h-px w-full bg-[#6B6B6B]/60" />

      {open && skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="rounded-full bg-[#BFE6C4] px-3 py-1 text-sm font-medium text-[#0A1930]">
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Icons ---------- */

// Small filled triangle used on the gap section headers (matches the design)
function Caret({ open }) {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      fill="currentColor"
      className={`transition-transform ${open ? '' : '-rotate-90'}`}
    >
      <path d="M0 0h9L4.5 6z" />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1v9m0 0L4.5 6.5M8 10l3.5-3.5M2 13h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.5 8a5.5 5.5 0 10-1.6 3.9M13.5 8V4.5M13.5 8H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}