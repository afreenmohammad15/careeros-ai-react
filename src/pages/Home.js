import React from "react";

const features = [
  {
    number: "01",
    title: "Search real job sites",
    detail: "Choose a role and city, then search current openings on LinkedIn, Naukri, Indeed India, Foundit, or Wellfound.",
    action: "Find roles",
    href: "#jobs"
  },
  {
    number: "02",
    title: "Know what to prepare",
    detail: "Compare a job description with your resume, review missing terms, and practise role-specific questions.",
    action: "Explore Career Studio",
    href: "#signup"
  },
  {
    number: "03",
    title: "Keep every application straight",
    detail: "After applying on the employer site, save the link, status, notes, and a follow-up date in one place.",
    action: "See how it works",
    href: "#application-tracking"
  }
];

function Home() {
  return (
    <div className="marketing-site" id="home">
      <header className="public-header">
        <a className="public-brand" href="#home" aria-label="CareerOS home">
          <span className="brand-mark">C</span>
          <span>career<span className="brand-accent">OS</span></span>
        </a>

        <nav className="public-nav" aria-label="Main navigation">
          <a href="#platform">How it works</a>
          <a href="#application-tracking">Application tracker</a>
          <a href="#interview-practice">Interview practice</a>
        </nav>

        <div className="public-actions">
          <a href="#login" className="ghost-button">Sign in</a>
          <a href="#signup" className="primary-button">Create account <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main>
        <section className="hero career-home-hero">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="kicker-dot" /> BUILT FOR THE WORK BEHIND A JOB SEARCH</div>
            <h1>Turn your experience<br />into your next<br /><span>opportunity.</span></h1>
            <p className="hero-description">
              Prepare with questions grounded in your resume, keep application details organised, and practise answers that reflect work you have actually done.
            </p>
            <div className="hero-actions">
              <a href="#signup" className="primary-button">Create your workspace <span aria-hidden="true">↗</span></a>
              <a href="#interview-practice" className="text-link">Explore interview practice <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-note">
              <span className="note-check">✓</span>
              Your resume and practice answers stay in this browser.
            </div>
          </div>

          <div className="home-prep-preview">
            <div className="home-prep-preview-heading">
              <span className="section-kicker">PRACTICE THAT STARTS WITH YOU</span>
              <span className="home-prep-count">100+</span>
            </div>
            <h2>Questions built around your resume</h2>
            <p>Explore your projects, skills, decisions, results, and lessons—not just a short generic list.</p>
            <div className="home-prep-topics" aria-label="Resume-based question topics">
              <span>Project deep dives</span>
              <span>Skills you list</span>
              <span>Impact and trade-offs</span>
              <span>Target-role practice</span>
            </div>
            <a className="home-prep-link" href="#interview-practice">See how interview practice works <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="home-workflow" aria-label="How to use CareerOS">
          <div className="home-workflow-intro">
            <span className="section-kicker">YOUR SEARCH, STEP BY STEP</span>
            <h2>Keep the work moving, not just the tabs.</h2>
            <p>CareerOS helps organise the work around your applications. You stay in control of where and when you apply.</p>
          </div>
          <div className="home-workflow-steps">
            <article>
              <span>01</span>
              <div><strong>Find an opening</strong><small>Search current roles on job boards and employer sites.</small></div>
            </article>
            <article>
              <span>02</span>
              <div><strong>Prepare for that role</strong><small>Use the role description to find resume evidence and practise questions.</small></div>
            </article>
            <article>
              <span>03</span>
              <div><strong>Apply on the source site</strong><small>Complete the actual application with the employer or job board.</small></div>
            </article>
            <article>
              <span>04</span>
              <div><strong>Log it and follow up</strong><small>Save the date, status, link, and next action in your tracker.</small></div>
            </article>
          </div>
        </section>

        <section className="platform-section" id="platform">
          <div className="section-heading">
            <div>
              <span className="section-kicker">TOOLS THAT HAVE A JOB TO DO</span>
              <h2>Less guesswork.<br /><span>More useful next steps.</span></h2>
            </div>
            <p>Designed around the real steps of looking for work—not made-up job listings or application counts.</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="feature-panel"
                id={feature.number === "02" ? "interview-practice" : feature.number === "03" ? "application-tracking" : undefined}
              >
                <div className="feature-card-top">
                  <span className="feature-number">{feature.number}</span>
                  <span className="feature-icon">{feature.number === "01" ? "⌕" : feature.number === "02" ? "◎" : "✓"}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.detail}</p>
                <a href={feature.href}>
                  {feature.action} <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="closing-cta">
          <div>
            <span className="section-kicker">START WITH ONE ROLE</span>
            <h2>Make your next application<br />easier to manage.</h2>
          </div>
          <a href="#signup" className="primary-button">Create your workspace <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="public-brand" href="#home" aria-label="CareerOS home">
          <span className="brand-mark">C</span>
          <span>career<span className="brand-accent">OS</span></span>
        </a>
        <span>Search is yours. We help you keep track.</span>
        <span>© CareerOS</span>
      </footer>
    </div>
  );
}

export default Home;
