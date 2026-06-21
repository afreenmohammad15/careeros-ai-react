import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>CareerOS AI</h1>
      <h2>Welcome to CareerOS AI</h2>
      <p>AI-Powered Placement Readiness Platform</p>

      <Link to="/dashboard">
        <button>Enter Dashboard</button>
      </Link>
    </div>
  );
}

export default Home;