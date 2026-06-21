import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <h1>CareerOS AI</h1>

      <h2>AI-Powered Placement Readiness Platform</h2>

      <p>
        Upload resumes, analyze resume quality,
        generate resume scores and practice
        interview questions.
      </p>

      <Link to="/dashboard">
        <button>Get Started</button>
      </Link>
    </div>
  );
}

export default Home;