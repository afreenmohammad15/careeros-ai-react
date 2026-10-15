import React, { useEffect, useMemo, useState } from "react";
import {
  addExternalApplication,
  getMyApplications,
  updateApplication
} from "../services/api";

const STATUS_OPTIONS = [
  ["APPLIED", "Applied"],
  ["REVIEWING", "In review"],
  ["INTERVIEW", "Interview"],
  ["OFFER", "Offer"],
  ["REJECTED", "Not moving forward"],
  ["WITHDRAWN", "Withdrawn"]
];

function toDateInput(value) {
  return value ? value.slice(0, 10) : "";
}

function todayInputValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function isOpenStatus(status) {
  return ["APPLIED", "REVIEWING", "INTERVIEW"].includes(status);
}

function toCsvField(value) {
  const text = String(value ?? "");
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

export function applicationsToCsv(applications) {
  const rows = [
    ["Job title", "Company", "Status", "Date applied", "Next follow-up", "Job link", "Notes"],
    ...applications.map((application) => [
      application.jobTitle,
      application.company,
      STATUS_OPTIONS.find(([value]) => value === application.status)?.[1] || application.status,
      toDateInput(application.appliedAt),
      application.followUpDate || "",
      application.sourceUrl || "",
      application.notes || ""
    ])
  ];
  return rows.map((row) => row.map(toCsvField).join(",")).join("\r\n");
}

function Applications({ token }) {
  const [applications, setApplications] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [filter, setFilter] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    jobTitle: "",
    company: "",
    appliedAt: todayInputValue(),
    status: "APPLIED",
    sourceUrl: "",
    notes: ""
  });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getMyApplications(token)
      .then(setApplications)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  const visibleApplications = useMemo(() => applications.filter((application) => {
    if (filter === "ACTIVE") return isOpenStatus(application.status);
    if (filter === "INTERVIEW") return application.status === "INTERVIEW";
    if (filter === "CLOSED") return ["OFFER", "REJECTED", "WITHDRAWN"].includes(application.status);
    if (["APPLIED", "REVIEWING"].includes(filter)) return application.status === filter;
    return true;
  }), [applications, filter]);

  const followUpsDue = applications.filter((application) =>
    application.followUpDate
    && application.followUpDate <= todayInputValue()
    && isOpenStatus(application.status)
  ).length;

  function getDraft(application) {
    return drafts[application.id] || {
      status: application.status,
      appliedAt: toDateInput(application.appliedAt),
      followUpDate: application.followUpDate || "",
      notes: application.notes || ""
    };
  }

  function updateDraft(applicationId, field, value) {
    const current = applications.find((application) => application.id === applicationId);
    if (!current) return;
    const currentDraft = getDraft(current);
    setDrafts((previous) => ({
      ...previous,
      [applicationId]: { ...currentDraft, [field]: value }
    }));
    setNotice("");
  }

  function updateDraftStatus(application, status) {
    const draft = getDraft(application);
    setDrafts((previous) => ({
      ...previous,
      [application.id]: { ...draft, status }
    }));
    setNotice("");
  }

  async function saveApplication(event, application) {
    event.preventDefault();
    const draft = getDraft(application);
    setSavingId(application.id);
    setError("");
    setNotice("");
    try {
      const updated = await updateApplication(token, application.id, {
        ...draft,
        followUpDate: draft.followUpDate || null
      });
      setApplications((current) => current.map((item) => item.id === updated.id ? updated : item));
      setDrafts((current) => {
        const next = { ...current };
        delete next[application.id];
        return next;
      });
      setNotice(`Updated ${updated.jobTitle} at ${updated.company}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleAddApplication(event) {
    event.preventDefault();
    setAdding(true);
    setError("");
    setNotice("");
    try {
      const added = await addExternalApplication(token, {
        ...newApplication,
        sourceUrl: newApplication.sourceUrl || null,
        notes: newApplication.notes || null
      });
      setApplications((current) => [added, ...current]);
      setNewApplication({
        jobTitle: "",
        company: "",
        appliedAt: todayInputValue(),
        status: "APPLIED",
        sourceUrl: "",
        notes: ""
      });
      setShowAddForm(false);
      setNotice(`${added.jobTitle} at ${added.company} is now in your tracker.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAdding(false);
    }
  }

  function exportApplications() {
    const csv = `\uFEFF${applicationsToCsv(visibleApplications)}`;
    const downloadUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `careeros-applications-${todayInputValue()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <div className="workspace-page">
      <div className="workspace-heading tracker-heading">
        <div>
          <span className="page-eyebrow">Your job search</span>
          <h1>Application tracker</h1>
          <p>Update each role as you hear back, and keep the next follow-up where you can see it.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setShowAddForm((shown) => !shown)}>
          {showAddForm ? "Close form" : "＋ Add an application"}
        </button>
      </div>

      <section className="tracker-summary" aria-label="Application summary">
        <div><span>Applications</span><strong>{applications.length}</strong></div>
        <div><span>In progress</span><strong>{applications.filter((application) => isOpenStatus(application.status)).length}</strong></div>
        <div><span>Interviews</span><strong>{applications.filter((application) => application.status === "INTERVIEW").length}</strong></div>
        <div className={followUpsDue ? "tracker-summary-due" : ""}><span>Follow-ups due</span><strong>{followUpsDue}</strong></div>
      </section>

      <aside className="tracker-purpose">
        <div>
          <strong>What is the tracker for?</strong>
          <p>Apply on the employer or job-board website first, then log the role here. Keep the company, application date, status, link, notes, and follow-up in one private list so you can see what needs attention.</p>
        </div>
        <a className="quiet-link" href="#jobs">Find openings in India ↗</a>
      </aside>

      {showAddForm && (
        <section className="tracker-add-panel" aria-labelledby="add-application-title">
          <div className="tracker-panel-heading">
            <div>
              <h2 id="add-application-title">Add an application</h2>
              <p>Include roles you applied to on a company site or elsewhere.</p>
            </div>
          </div>
          <form className="tracker-add-form" onSubmit={handleAddApplication}>
            <label className="field">
              <span>Job title</span>
              <input
                value={newApplication.jobTitle}
                onChange={(event) => setNewApplication({ ...newApplication, jobTitle: event.target.value })}
                maxLength={255}
                required
              />
            </label>
            <label className="field">
              <span>Company</span>
              <input
                value={newApplication.company}
                onChange={(event) => setNewApplication({ ...newApplication, company: event.target.value })}
                maxLength={255}
                required
              />
            </label>
            <label className="field">
              <span>Date applied</span>
              <input
                type="date"
                value={newApplication.appliedAt}
                onChange={(event) => setNewApplication({ ...newApplication, appliedAt: event.target.value })}
                required
              />
            </label>
            <label className="field tracker-add-url">
              <span>Job link <small>optional</small></span>
              <input
                type="url"
                placeholder="https://"
                value={newApplication.sourceUrl}
                onChange={(event) => setNewApplication({ ...newApplication, sourceUrl: event.target.value })}
                maxLength={2000}
              />
            </label>
            <label className="field tracker-add-notes">
              <span>Notes <small>optional</small></span>
              <textarea
                rows="3"
                value={newApplication.notes}
                onChange={(event) => setNewApplication({ ...newApplication, notes: event.target.value })}
                maxLength={5000}
                placeholder="Recruiter contact, referral, or details to remember"
              />
            </label>
            <div className="tracker-add-actions">
              <span>This role starts with status “Applied”. You can change it any time.</span>
              <button className="primary-button" type="submit" disabled={adding}>
                {adding ? "Adding…" : "Add to tracker"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="tracker-panel">
        <div className="tracker-panel-heading tracker-list-heading">
          <div><h2>Your applications</h2><p>Keep dates, status, and follow-ups up to date.</p></div>
          <div className="tracker-list-actions">
            <label className="tracker-filter">
              <span className="visually-hidden">Filter applications</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="ALL">All applications</option>
                <option value="ACTIVE">In progress</option>
                <option value="APPLIED">Applied</option>
                <option value="REVIEWING">In review</option>
                <option value="INTERVIEW">Interview</option>
                <option value="CLOSED">Closed or offer</option>
              </select>
            </label>
            <button
              className="secondary-button tracker-export-button"
              type="button"
              onClick={exportApplications}
              disabled={loading || !visibleApplications.length}
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}
        {notice && <p className="auth-notice" role="status">{notice}</p>}
        {loading ? <p className="empty-state">Loading your applications…</p> : visibleApplications.length ? (
          <div className="tracker-application-list">
            {visibleApplications.map((application) => {
              const draft = getDraft(application);
              const statusLabel = STATUS_OPTIONS.find(([value]) => value === application.status)?.[1] || application.status;
              return (
                <article className="tracker-application" key={application.id}>
                  <div className="tracker-application-top">
                    <span className="company-mark">{(application.company || "?").slice(0, 1).toUpperCase()}</span>
                    <div className="application-role">
                      <strong>{application.jobTitle}</strong>
                      <span>{application.company} <i>·</i> Applied {formatDate(application.appliedAt)}</span>
                    </div>
                    <span className={`application-status status-${application.status.toLowerCase()}`}>{statusLabel}</span>
                    {application.sourceUrl && (
                      <a className="tracker-job-link" href={application.sourceUrl} target="_blank" rel="noreferrer">
                        Job post ↗
                      </a>
                    )}
                  </div>
                  <form className="tracker-edit-form" onSubmit={(event) => saveApplication(event, application)}>
                    <label className="field">
                      <span>Status</span>
                      <select value={draft.status} onChange={(event) => updateDraftStatus(application, event.target.value)}>
                        {STATUS_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                      </select>
                    </label>
                    <label className="field">
                      <span>Date applied</span>
                      <input type="date" value={draft.appliedAt} onChange={(event) => updateDraft(application.id, "appliedAt", event.target.value)} required />
                    </label>
                    <label className="field">
                      <span>Next follow-up</span>
                      <input type="date" value={draft.followUpDate} onChange={(event) => updateDraft(application.id, "followUpDate", event.target.value)} />
                    </label>
                    <label className="field tracker-edit-notes">
                      <span>Notes</span>
                      <textarea rows="2" value={draft.notes} onChange={(event) => updateDraft(application.id, "notes", event.target.value)} maxLength={5000} placeholder="Add a reminder or conversation notes" />
                    </label>
                    <div className="tracker-edit-footer">
                      <span>Applied {formatDate(application.appliedAt)} · Updated {formatDate(application.updatedAt || application.appliedAt)}</span>
                      <button className="secondary-button" type="submit" disabled={savingId === application.id}>
                        {savingId === application.id ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </form>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state tracker-empty">
            <span>↗</span>
            <h2>{applications.length ? "No applications in this view" : "Start keeping track"}</h2>
            <p>{applications.length ? "Choose another filter to see more of your applications." : "Add a role you applied to anywhere, or browse current openings and apply on the employer site."}</p>
            {!applications.length && (
              <div className="tracker-empty-actions">
                <button className="secondary-button" type="button" onClick={() => setShowAddForm(true)}>Add an application</button>
                <a className="quiet-link" href="#jobs">Browse recent roles ↗</a>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Applications;
