import React, { useState } from "react";

function App() {
  const [name, setName] = useState("Afreen Mohammad");
  const [email, setEmail] = useState("afreenmohammad155@gmail.com");
  const [skills, setSkills] = useState(
    "HTML, CSS, JavaScript, React, GitHub"
  );
  const [projects, setProjects] = useState(
    "CareerOS AI, Resume Analyzer, Portfolio Generator"
  );

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f4f7fc",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#007bff,#00c6ff)",
          color: "white",
          textAlign: "center",
          padding: "50px 20px",
        }}
      >
        <h1>{name}</h1>
        <h3>Aspiring Full Stack & AI Developer</h3>
      </div>

      {/* Form */}
      <div
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#007bff" }}>Portfolio Generator</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Projects"
          value={projects}
          onChange={(e) => setProjects(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Portfolio Preview */}
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ color: "#007bff" }}>About Me</h2>
          <p>
            I am an aspiring Full Stack & AI Developer passionate about
            building modern web applications and solving real-world problems
            using technology.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#007bff" }}>Skills</h2>
          <p>{skills}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#007bff" }}>Projects</h2>
          <p>{projects}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#007bff" }}>Contact</h2>
          <p>Email: {email}</p>
          <p>GitHub: github.com/afreenmohammad15</p>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "40px",
          background: "#111827",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        © 2026 Portfolio Generator | Built by Afreen Mohammad
      </footer>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  marginTop: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

export default App;