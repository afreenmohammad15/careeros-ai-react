import React from "react";
import ResumeUpload from "./ResumeUpload";
import Interview from "./Interview";
import "./App.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="card">
        <h1>🚀 CareerOS AI</h1>
        <h2>Login Successful!</h2>
        <p className="welcome-text">
          Welcome to your AI-powered career assistant.
        </p>
      </div>

      <div className="card">
        <ResumeUpload />
      </div>

      <div className="card">
        <Interview />
      </div>
    </div>
  );
}

export default Dashboard;