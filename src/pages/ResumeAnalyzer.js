import React, { useState } from "react";

const sampleResumeText = `Senior Frontend Engineer with 5+ years of experience building scalable product experiences in React, TypeScript, and performance-first interfaces. Led design systems, launched analytics dashboards, optimized accessibility, and collaborated with product teams to improve conversion and retention.`;

const keywordMap = ["react", "product", "performance", "accessibility", "leadership", "analytics", "typescript"];

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState(sampleResumeText);
  const [analysis, setAnalysis] = useState({ score: 88, matched: 6, missing: ["system design", "stakeholder management"] });

  const handleAnalyze = () => {
    let matched = 0;
    const missing = [];

    keywordMap.forEach((word) => {
      if (resumeText.toLowerCase().includes(word)) {
        matched += 1;
      } else {
        missing.push(word);
      }
    });

    const score = Math.min(98, Math.max(52, Math.round((matched / keywordMap.length) * 100)));

    setAnalysis({
      score,
      matched,
      missing: missing.slice(0, 2)
    });
  };

  return (
    <div className="resume-page">
      <div className="page-header">
        <div>
          <h1>Resume intelligence</h1>
          <p>Measure clarity, ATS compatibility, and role-fit language.</p>
        </div>
        <button className="primary-button" onClick={handleAnalyze}>Analyze resume</button>
      </div>

      <div className="signal-grid">
        <div className="resume-card">
          <h3>Resume content</h3>
          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume text here..."
          />
        </div>

        <div className="resume-card">
          <h3>Assessment</h3>
          <div className="analysis-result">
            <div className="analysis-score">
              <strong>{analysis.score}</strong>
              <span>/100</span>
            </div>
            <div className="progress-rail" aria-label="Resume score">
              <div className="progress-fill" style={{ width: `${analysis.score}%` }} />
            </div>
            <p style={{ marginTop: "12px" }}>
              {analysis.matched} of {keywordMap.length} role-fit keywords detected.
            </p>
          </div>

          <div className="feature-list">
            <div className="list-item">
              <div>
                <strong>ATS strength</strong>
                <span>Strong keyword alignment</span>
              </div>
              <span className="badge success">Excellent</span>
            </div>
            <div className="list-item">
              <div>
                <strong>Missing signals</strong>
                <span>{analysis.missing.join(", ") || "None"}</span>
              </div>
              <span className="badge neutral">Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;