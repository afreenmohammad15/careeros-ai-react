import React, { useState } from "react";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setAnalysis(null);
  };

  const handleAnalyze = () => {
    if (!file) {
      window.alert("Please select a resume file to analyze.");
      return;
    }

    const score = file.name.toLowerCase().includes("senior") ? 94 : 88;
    setAnalysis({
      score,
      filename: file.name,
      summary: "This resume is strong for product-focused frontend roles. Add clearer impact metrics and ATS keywords to strengthen fit.",
      keywords: ["React", "TypeScript", "Accessibility", "Product strategy", "Analytics"]
    });
  };

  return (
    <div className="resume-page">
      <div className="page-header">
        <div>
          <h1>Resume intelligence</h1>
          <p>Upload and assess your latest resume against a target role profile.</p>
        </div>
        <button className="primary-button" onClick={handleAnalyze}>Scan resume</button>
      </div>

      <div className="signal-grid">
        <div className="resume-card">
          <h3>Upload document</h3>
          <input className="file-input" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

          {file && (
            <div className="analysis-result">
              <strong>{file.name}</strong>
              <p style={{ marginTop: "8px" }}>Ready for a targeted role fit review.</p>
            </div>
          )}
        </div>

        <div className="resume-card">
          <h3>Role fit summary</h3>
          {analysis ? (
            <>
              <div className="analysis-score">
                <strong>{analysis.score}</strong>
                <span>/100</span>
              </div>
              <div className="progress-rail">
                <div className="progress-fill" style={{ width: `${analysis.score}%` }} />
              </div>
              <p style={{ marginTop: "12px" }}>{analysis.summary}</p>
              <div className="feature-list">
                {analysis.keywords.map((keyword) => (
                  <div key={keyword} className="list-item">
                    <strong>{keyword}</strong>
                    <span className="badge success">Detected</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Select a file to assess your resume against job-fit strengths and improvement areas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;