"use client";

import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AnalysisResultPage from "../../components/results/AnalysisResultPage";
import { downloadReport } from "../../lib/downloadReport";

const APP_LINKS = [
  { label: "HOME", href: "/" },
  { label: "CONTACT", href: "/contact" },
];

export default function TryPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }
    setError("");
    setShowResults(true);
  };

  // Passed to AnalysisResultPage as `runAnalysis`. Called on mount and
  // again on "Re-Analyze".
  const runAnalysis = async () => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    const response = await fetch("/api/analyse", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    return data;
  };

  if (showResults) {
    return (
      <AnalysisResultPage runAnalysis={runAnalysis} onDownloadReport={downloadReport} />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1930] text-white flex flex-col">
      <Navbar links={APP_LINKS} />

      <main className="flex-1 flex flex-col items-center py-8 px-4">
        {/* Hero Text */}
        <div className="w-full max-w-2xl mt-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-blue-50 mb-2">
            Upload your resume and the job <br /> you're chasing.
          </h1>
        </div>

        {/* Main Form Box */}
        <div className="w-full max-w-2xl border-2 border-white rounded-[2.5rem] p-6 md:p-8">
          {/* File Upload Box */}
          <div className="mb-6">
            <label className="block mb-3 text-sm ml-2">Upload your resume.</label>
            <div className="relative w-full h-40 bg-[#98A2B3] rounded-3xl flex flex-col items-center justify-center text-[#0A1930] cursor-pointer hover:bg-gray-400 transition duration-300">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className="w-8 h-8 mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="font-bold text-xs tracking-wide">
                {resumeFile ? resumeFile.name.toUpperCase() : "PDF OR TXT"}
              </span>
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="mb-10">
            <label className="block mb-3 text-sm ml-2">Paste the job posting</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here......"
              className="w-full h-48 bg-[#98A2B3] rounded-3xl p-6 text-[#0A1930] placeholder-gray-600 focus:outline-none resize-none font-medium"
            ></textarea>
          </div>

          {error && <p className="text-red-400 text-sm mb-4 text-center font-semibold">{error}</p>}

          <button
            onClick={handleAnalyzeClick}
            className="w-full bg-[#D4ED31] text-[#0A1930] font-black text-sm tracking-widest py-4 rounded-xl hover:bg-[#bacc22] transition duration-300"
          >
            ANALYSE
          </button>

          <p className="text-center text-xs mt-4 text-gray-300">Add a resume and a job posting to continue</p>
        </div>
      </main>

      <Footer links={APP_LINKS} />
    </div>
  );
}
