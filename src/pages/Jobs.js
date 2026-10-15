import React, { useEffect, useMemo, useState } from "react";
import { buildJobSearchLinks, PENDING_JOB_SEARCH_KEY, roleSuggestions } from "../services/jobSearch";

function Jobs({ profile }) {
  const [search, setSearch] = useState(profile?.targetRole || "Software Engineer");
  const [location, setLocation] = useState(profile?.location || "India");
  const [employmentType, setEmploymentType] = useState("Any role");
  const [searchNotice, setSearchNotice] = useState("");
  useEffect(() => {
    try {
      const pendingSearch = window.sessionStorage.getItem(PENDING_JOB_SEARCH_KEY);
      if (!pendingSearch) return;
      const parsed = JSON.parse(pendingSearch);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("The saved search details were invalid.");
      }
      setSearch(typeof parsed.role === "string" && parsed.role.trim() ? parsed.role : "Software Engineer");
      setLocation(typeof parsed.location === "string" && parsed.location.trim() ? parsed.location : "India");
      if (["Any role", "Fresher", "Internship", "Full-time", "Remote"].includes(parsed.jobType)) {
        setEmploymentType(parsed.jobType);
      }
      window.sessionStorage.removeItem(PENDING_JOB_SEARCH_KEY);
    } catch {
      setSearchNotice("The search details from the home page could not be loaded. Enter your search below.");
    }
  }, []);

  const jobLinks = useMemo(
    () => buildJobSearchLinks(search, location, employmentType),
    [employmentType, location, search]
  );

  return (
    <div className="workspace-page">
      <div className="workspace-heading">
        <div>
          <span className="page-eyebrow">Live job boards · India</span>
          <h1>Find real openings</h1>
          <p>Search current employer-posted openings on established job sites. Choose a role and location to open live results.</p>
        </div>
        <a className="quiet-link" href="#applications">Track an application ↗</a>
      </div>

      <section className="marketplace-hero">
        <div>
          <span className="marketplace-hero-label">SEARCH REAL JOB SITES</span>
          <h2>Current openings, from the source.</h2>
          <p>CareerOS does not invent listings or submit applications. Search a job board, apply on its website, then record the application here.</p>
        </div>
        <a className="marketplace-tracker-link" href="#applications">How the application tracker helps ↗</a>
      </section>

      <section className="job-explorer live-job-explorer" aria-label="Search live job boards">
        {searchNotice && <p className="auth-notice" role="status">{searchNotice}</p>}
        <div className="job-search-row live-job-search-row">
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Job title or skill"
              aria-label="Search by job title or skill"
              maxLength={100}
            />
          </label>
          <label className="search-field">
            <span aria-hidden="true">⌖</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="India or a city"
              aria-label="Job location"
              maxLength={100}
            />
          </label>
          <select
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value)}
            aria-label="Job type"
          >
            <option>Any role</option>
            <option>Fresher</option>
            <option>Internship</option>
            <option>Full-time</option>
            <option>Remote</option>
          </select>
        </div>

        <div className="job-suggestion-list" aria-label="Popular job searches in India">
          <span>Popular searches</span>
          {roleSuggestions.map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => setSearch(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>

        <div className="job-results-bar">
          <div><strong>{jobLinks.length}</strong> live job-board searches <span>· for {location.trim() || "India"}</span></div>
          <span>Results update on each job site</span>
        </div>

        <div className="live-job-source-list">
          {jobLinks.map((jobLink) => (
            <article className="live-job-source-card" key={jobLink.name}>
              <span className="company-mark">{jobLink.name.slice(0, 1)}</span>
              <div>
                <h2>{jobLink.name}</h2>
                <p>{jobLink.description}</p>
              </div>
              <a
                className="primary-button"
                href={jobLink.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Search ${jobLink.name} for ${search || "jobs"} in ${location || "India"}`}
              >
                View live openings ↗
              </a>
            </article>
          ))}
        </div>

        <aside className="live-job-notice">
          <strong>Why do I see results on another site?</strong>
          <p>Job boards update listings throughout the day and may require an account. Opening the source site keeps the employer, posting date, and application process with the publisher instead of showing stale or made-up vacancies here.</p>
        </aside>
      </section>
    </div>
  );
}

export default Jobs;
