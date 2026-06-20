import React from "react";
import ResumeUpload from "./ResumeUpload";
import Interview from "./Interview";

function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to CareerOS AI 🚀</h1>

      <h2>Login Successful!</h2>

      <p>You are now inside the dashboard.</p>

      <ResumeUpload />

      <hr
        style={{
          width: "80%",
          margin: "40px auto",
        }}
      />

      <Interview />
    </div>
  );
}

export default Dashboard;