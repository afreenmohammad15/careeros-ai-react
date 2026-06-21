function App() {
  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f4f7fc",
        minHeight: "100vh",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ color: "#007bff" }}>
          📄 AI Resume Analyzer
        </h1>

        <p>
          Upload your resume and get an instant ATS score.
        </p>

        <hr />

        <h2>Upload Resume</h2>

        <input type="file" />

        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "10px"
          }}
        >
          <h2>Analysis Result</h2>

          <p>✅ ATS Score: <b>85%</b></p>

          <p>
            ✅ Skills Found:
            HTML, CSS, JavaScript, React
          </p>

          <p>
            ⚠ Missing Keywords:
            Node.js, MongoDB
          </p>

          <p>
            ⭐ Recommendation:
            Add backend projects to improve profile.
          </p>
        </div>

        <footer
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "gray"
          }}
        >
          Built by Afreen Mohammad
        </footer>
      </div>
    </div>
  );
}

export default App;git