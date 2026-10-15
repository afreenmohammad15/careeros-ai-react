import React, { useEffect, useMemo, useState } from "react";
import { getMyApplications } from "./services/api";
import { buildJobSearchLinks } from "./services/jobSearch";

const profileFields = [
  { key: "phone", label: "Phone", type: "tel", placeholder: "Add your phone number" },
  { key: "location", label: "Location", type: "text", placeholder: "City, country" },
  { key: "experienceLevel", label: "Experience level", type: "text", placeholder: "e.g. Mid-level" },
  { key: "targetRole", label: "Target role", type: "text", placeholder: "e.g. Product Designer" },
  { key: "careerGoal", label: "Career goal", type: "textarea", placeholder: "What would meaningful progress look like for you?" },
  { key: "bio", label: "Career summary", type: "textarea", placeholder: "A short summary of your experience and strengths" }
];

function Dashboard({ profile, user, token, onSaveProfile }) {
  const [draft, setDraft] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [applications, setApplications] = useState([]);
  const [overviewError, setOverviewError] = useState("");

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  useEffect(() => {
    getMyApplications(token)
      .then(setApplications)
      .catch((error) => setOverviewError(error.message));
  }, [token]);

  const jobSearchLinks = useMemo(
    () => buildJobSearchLinks(profile.targetRole || "Software Engineer", profile.location || "India").slice(0, 3),
    [profile.location, profile.targetRole]
  );

  const completion = useMemo(() => {
    const fields = ["fullName", "phone", "location", "experienceLevel", "targetRole", "careerGoal", "bio"];
    const completed = fields.filter((field) => String(draft[field] || "").trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [draft]);

  function updateField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      await onSaveProfile(draft);
      setSaved(true);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Career overview</span>
          <h1>Welcome back, {profile.fullName || user.name}.</h1>
          <p>Check your applications, update your profile, or prepare for an interview.</p>
        </div>
        <div className="inline-action">
          <a href="#resume" className="primary-button">Review resume</a>
        </div>
      </div>

      <section className="stats-grid profile-stats" aria-label="Your career overview">
        <div className="metric-panel">
          <span className="tile-tag">Profile completion</span>
          <span className="value">{completion}%</span>
          <div className="progress-rail" aria-label={`${completion}% profile complete`}>
            <div className="progress-fill" style={{ width: `${completion}%` }} />
          </div>
        </div>
        <div className="metric-panel">
          <span className="tile-tag">Applications</span>
          <span className="value">{applications.length}</span>
          <small>{applications.filter((application) => application.status === "INTERVIEW").length} at interview stage</small>
        </div>
        <div className="metric-panel">
          <span className="tile-tag">Your next role</span>
          <span className="profile-stat-value">{profile.targetRole || "Set a career direction"}</span>
          <small>{profile.location || "Add a location to personalize your search"}</small>
        </div>
      </section>

      {overviewError && <p className="auth-error" role="alert">Could not load your career overview: {overviewError}</p>}

      <section className="recent-roles-section" aria-labelledby="recent-roles-title">
        <div className="recent-roles-heading">
          <div>
            <span className="page-eyebrow">Live job boards · {profile.location || "India"}</span>
            <h2 id="recent-roles-title">Find current openings</h2>
            <p>Open current searches on trusted job sites, apply with the employer, then track each application here.</p>
          </div>
          <a className="quiet-link" href="#jobs">Search job sites ↗</a>
        </div>
        <div className="recent-roles-grid">
          {jobSearchLinks.map((jobLink) => (
            <article className="recent-role-card live-job-dashboard-card" key={jobLink.name}>
              <div className="recent-role-company">
                <span className="company-mark">{jobLink.name.slice(0, 1)}</span>
                <span>{jobLink.name}</span>
              </div>
              <h3>{profile.targetRole || "Software Engineer"}</h3>
              <p>{profile.location || "India"} · Current openings from the source</p>
              <a className="recent-role-apply" href={jobLink.url} target="_blank" rel="noopener noreferrer">
                Search openings <span>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-workbench">
        <div className="workbench-main">
          <div className="workbench-heading">
            <div><span className="page-eyebrow">Your workspace</span><h2>Your next steps</h2></div>
            <span className="workbench-indicator"><i /> ACTIONS</span>
          </div>
          <div className="quick-action-grid">
            <a className="quick-action-card" href="#jobs">
              <span className="quick-action-icon">⌕</span><span><strong>Discover opportunities</strong><small>Find roles aligned with your next move</small></span><b>↗</b>
            </a>
            <a className="quick-action-card" href="#resume">
              <span className="quick-action-icon quick-icon-blue">✳</span><span><strong>Update your resume</strong><small>Keep your experience ready to practise</small></span><b>↗</b>
            </a>
            <a className="quick-action-card" href="#interview">
              <span className="quick-action-icon quick-icon-gold">◎</span><span><strong>Practice with purpose</strong><small>Build confidence before the conversation</small></span><b>↗</b>
            </a>
            <a className="quick-action-card" href="#career-studio">
              <span className="quick-action-icon">✎</span><span><strong>Prepare for a role</strong><small>Check resume keywords and draft a cover letter</small></span><b>↗</b>
            </a>
            <a className="quick-action-card" href="#applications">
              <span className="quick-action-icon quick-icon-blue">✓</span><span><strong>Keep applications organised</strong><small>Log the role, next step, and follow-up date</small></span><b>↗</b>
            </a>
          </div>
          <div className="career-goal-card">
            <span className="career-goal-star">↗</span>
            <div><span className="career-goal-label">CAREER GOAL</span><strong>{profile.careerGoal || "Add a career goal to your profile."}</strong></div>
            <a href="#career-profile">Set your goal ↗</a>
          </div>
        </div>

        <aside className="recent-activity">
          <div className="workbench-heading"><div><span className="page-eyebrow">Application activity</span><h2>Recent applications</h2></div><a href="#applications">View all</a></div>
          {applications.length ? (
            <div className="recent-application-list">
              {applications.slice(0, 4).map((application) => (
                <div className="recent-application" key={application.id}>
                  <span className="company-mark">{application.company.slice(0, 1).toUpperCase()}</span>
                  <div><strong>{application.jobTitle}</strong><small>{application.company}</small></div>
                  <span className={`application-status status-${application.status.toLowerCase()}`}>{application.status === "INTERVIEW" ? "Interview" : application.status === "REVIEWING" ? "In review" : application.status === "OFFER" ? "Offer" : application.status === "REJECTED" ? "Closed" : "Applied"}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="recent-empty"><span>↗</span><p>Your application activity will show here.</p><a href="#jobs">Explore open roles</a></div>
          )}
          <div className="target-role-note"><span>YOUR CURRENT FOCUS</span><strong>{profile.targetRole || "Career direction not set"}</strong><small>{user.email}</small></div>
        </aside>
      </section>

      <section className="profile-editor-card" id="career-profile">
        <div>
          <span className="page-eyebrow">Your foundation</span>
          <h2>Career profile</h2>
          <p>Keep your experience, direction, and career goals in one place. Your details are saved to your account.</p>
          <div className="profile-editor-hint"><span>↗</span><p>Your target role is used to shape interview practice questions.</p></div>
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="profile-name">Full name</label>
            <input
              id="profile-name"
              type="text"
              value={draft.fullName || ""}
              onChange={(event) => updateField("fullName", event.target.value)}
              required
            />
          </div>
          {profileFields.map((field) => (
            <div className="field" key={field.key}>
              <label htmlFor={`profile-${field.key}`}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  id={`profile-${field.key}`}
                  rows="4"
                  placeholder={field.placeholder}
                  value={draft[field.key] || ""}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              ) : (
                <input
                  id={`profile-${field.key}`}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={draft[field.key] || ""}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              )}
            </div>
          ))}
          {saveError && <p className="auth-error" role="alert">{saveError}</p>}
          {saved && <p className="save-success" role="status">Profile saved.</p>}
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Dashboard;
