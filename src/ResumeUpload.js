import React, { useState } from "react";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setScore(null);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a resume first!");
      return;
    }

    // Generate a score between 60 and 100
    const predictedScore = Math.floor(Math.random() * 41) + 60;

    setScore(predictedScore);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Resume Upload</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      <br />
      <br />

      {file && (
        <p>
          <b>Selected File:</b> {file.name}
        </p>
      )}

      <button onClick={handleUpload}>Upload Resume</button>

      {score && (
        <div style={{ marginTop: "20px" }}>
          <h3>Resume Analysis Result</h3>
          <p>
            <b>Predicted Score:</b> {score}/100
          </p>

          {score >= 85 && (
            <p style={{ color: "green" }}>
              Excellent Resume 🚀
            </p>
          )}

          {score >= 70 && score < 85 && (
            <p style={{ color: "orange" }}>
              Good Resume 👍
            </p>
          )}

          {score < 70 && (
            <p style={{ color: "red" }}>
              Needs Improvement ⚠️
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;