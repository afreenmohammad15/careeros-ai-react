import React from "react";
import ResumeUpload from "./ResumeUpload";

function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to CareerOS AI 🚀</h1>
      <h2>Login Successful!</h2>
      <p>You are now inside the dashboard.</p>

      <ResumeUpload />
    </div>
  );
}

export default Dashboard;