import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>CareerOS AI Dashboard</h1>

      <Link to="/resume-upload">
        <button>Resume Upload</button>
      </Link>

      <br /><br />

      <Link to="/resume-analyzer">
        <button>Resume Analyzer</button>
      </Link>

      <br /><br />

      <Link to="/interview">
        <button>Mock Interview</button>
      </Link>
    </div>
  );
}

export default Dashboard;