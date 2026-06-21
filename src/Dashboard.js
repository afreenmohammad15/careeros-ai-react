import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard">

      <h1>CareerOS AI Dashboard</h1>

      <div className="card-container">

        <div className="card">
          <h3>Resume Upload</h3>
          <p>Upload your resume</p>

          <Link to="/resume-upload">
            <button>Open</button>
          </Link>
        </div>

        <div className="card">
          <h3>Resume Analyzer</h3>
          <p>Analyze resume quality</p>

          <Link to="/resume-analyzer">
            <button>Open</button>
          </Link>
        </div>

        <div className="card">
          <h3>Mock Interview</h3>
          <p>Practice interviews</p>

          <Link to="/interview">
            <button>Open</button>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;