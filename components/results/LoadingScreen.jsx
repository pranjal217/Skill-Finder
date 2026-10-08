"use client";

import { useEffect, useState } from 'react';
import ProgressRing from './Ring';

const STEPS = [
  'Reading your resume',
  'Parsing the job posting',
  'Comparing skills against requirements',
  'Prioritizing your gaps',
];

// ~15s total across 4 steps, matching the "about 15 seconds" copy.
// The last step stays "active" (not "done") until the real result arrives,
// since we don't know exactly when Gemini will finish.
const STEP_DURATION = 4500;

export default function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= STEPS.length - 1) return;
    const timer = setTimeout(() => setActiveStep((s) => s + 1), STEP_DURATION);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <div className="rounded-[32px] bg-[#EAEAEA] px-8 py-12 sm:px-14 sm:py-14 max-w-xl mx-auto text-center">
      <h1 className="font-serif text-[28px] sm:text-[32px] text-[#0A1930] leading-tight">
        Reading between the lines.
      </h1>
      <p className="mt-2 text-sm text-[#4B4B4B]">This usually takes about 15 seconds.</p>

      <div className="mt-10 flex justify-center">
        <ProgressRing
          size={200}
          strokeWidth={24}
          indeterminate
          segments={[
            { value: 72, color: '#1E8E3E' },
            { value: 28, color: '#BFE6C4' },
          ]}
        >
          <span className="text-xs font-semibold tracking-wide text-[#0A1930]">ANALYZING</span>
        </ProgressRing>
      </div>

      <ul className="mt-10 space-y-4 text-left max-w-xs mx-auto">
        {STEPS.map((label, i) => {
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
          return (
            <li key={label} className="flex items-center gap-3">
              <StepIcon state={state} />
              <span className={state === 'pending' ? 'text-[#9A9A9A]' : 'text-[#1C1C1C] font-medium'}>
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StepIcon({ state }) {
  if (state === 'done') {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0A1930]">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path
            d="M1 5L4.5 8.5L11 1.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (state === 'active') {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0A1930]">
        <span className="h-[2px] w-3 bg-white rounded-full" />
      </span>
    );
  }
  return <span className="h-6 w-6 shrink-0 rounded-full border-2 border-[#C9C9C9]" />;
}
