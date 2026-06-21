import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>🚀 CareerOS AI</h1>

      <h2>AI-Powered Placement Readiness Platform</h2>

      <p>
        CareerOS AI helps students improve resumes,
        prepare for interviews and track internship
        applications.
      </p>

      <h2>Features</h2>

      <ul>
        <li>Resume Upload</li>
        <li>Resume Analysis</li>
        <li>Resume Score</li>
        <li>Mock Interview</li>
        <li>Internship Tracker</li>
      </ul>

      <h2>Tech Stack</h2>

      <p>
        React.js | JavaScript | GitHub Pages
      </p>

      <Link to="/dashboard">
        <button>Get Started</button>
      </Link>
    </div>
  );
}

export default Home;