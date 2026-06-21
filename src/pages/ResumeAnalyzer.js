import React, { useState } from "react";

function ResumeAnalyzer() {
  const [score, setScore] = useState(null);

  const analyzeResume = () => {
    const keywords = ["react", "javascript", "html", "css", "git"];

    let resumeText = prompt(
      "Paste your resume text here for analysis"
    );

    if (!resumeText) return;

    let found = 0;

    keywords.forEach((word) => {
      if (
        resumeText.toLowerCase().includes(word)
      ) {
        found++;
      }
    });

    const calculatedScore =
      Math.round((found / keywords.length) * 100);

    setScore(calculatedScore);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Resume Analyzer</h1>

      <button onClick={analyzeResume}>
        Analyze Resume
      </button>

      {score !== null && (
        <>
          <h2>Resume Score: {score}/100</h2>

          <div
            style={{
              width: "300px",
              background: "#ddd",
              height: "20px",
            }}
          >
            <div
              style={{
                width: `${score}%`,
                background: "green",
                height: "20px",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ResumeAnalyzer;