import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#2563eb",
        padding: "15px",
      }}
    >
      <Link to="/" style={{ color: "white", margin: "10px" }}>
        Home
      </Link>

      <Link
        to="/dashboard"
        style={{ color: "white", margin: "10px" }}
      >
        Dashboard
      </Link>

      <Link
        to="/resume-upload"
        style={{ color: "white", margin: "10px" }}
      >
        Resume Upload
      </Link>

      <Link
        to="/resume-analyzer"
        style={{ color: "white", margin: "10px" }}
      >
        Analyzer
      </Link>

      <Link
        to="/interview"
        style={{ color: "white", margin: "10px" }}
      >
        Interview
      </Link>
    </nav>
  );
}

export default Navbar;