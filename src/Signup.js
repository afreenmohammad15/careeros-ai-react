import React, { useState } from "react";

function Signup({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ name, email, password });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1>Create your account</h1>
      <p>Set up your job search workspace. It takes about a minute.</p>

      {error && <p className="auth-error" role="alert">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="8+ characters, with a number and capital letter"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
            title="Use at least 8 characters with uppercase and lowercase letters and a number."
            required
          />
        </div>

        <button className="primary-button auth-cta" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="auth-privacy-note">Your resume and interview notes stay in your browser.</p>

      <p style={{ marginTop: "20px" }}>
        Already have an account? <a href="#login" className="muted-link">Sign in</a>
      </p>
    </>
  );
}

export default Signup;
