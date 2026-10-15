import React, { useEffect, useMemo, useState } from "react";

const RESUME_STORAGE_KEY = "careeros.resumeText";
const LETTER_STORAGE_KEY = "careeros.coverLetterDraft";
const STOP_WORDS = new Set([
  "about", "above", "after", "again", "against", "along", "also", "among", "an", "and",
  "any", "are", "around", "because", "been", "before", "being", "below", "between",
  "both", "but", "can", "could", "during", "each", "for", "from", "have", "having",
  "into", "its", "more", "most", "must", "not", "our", "out", "over", "role", "should",
  "some", "such", "than", "that", "the", "their", "then", "there", "these", "they",
  "this", "those", "through", "under", "use", "using", "very", "was", "were", "what",
  "when", "where", "which", "while", "will", "with", "within", "work", "you", "your"
]);

function loadResume() {
  try {
    return window.localStorage.getItem(RESUME_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function loadLetterDraft() {
  try {
    return window.localStorage.getItem(LETTER_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function normalizeTerm(term) {
  return term.toLowerCase().replace(/[^a-z0-9+#.]/g, "");
}

function normalizeText(text) {
  return ` ${text.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim()} `;
}

export function analyzeJobMatch(resumeText, jobDescription) {
  const frequencies = new Map();
  const terms = jobDescription.toLowerCase().match(/[a-z][a-z0-9+#.]{2,}/g) || [];

  terms.forEach((term) => {
    const normalized = normalizeTerm(term);
    if (!STOP_WORDS.has(normalized) && !/^\d+$/.test(normalized)) {
      frequencies.set(normalized, (frequencies.get(normalized) || 0) + 1);
    }
  });

  const keywords = [...frequencies.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 15)
    .map(([keyword]) => keyword);
  const normalizedResume = normalizeText(resumeText);
  const matched = keywords.filter((keyword) => normalizedResume.includes(` ${keyword} `));

  return {
    score: keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0,
    matched,
    missing: keywords.filter((keyword) => !matched.includes(keyword)),
    keywordCount: keywords.length
  };
}

function getResumeEvidence(resumeText, matchedKeywords) {
  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•▪]|\d+[.)])\s*/, "").replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 35 && line.length <= 500 && !/@|https?:\/\//i.test(line));

  return lines
    .map((line, index) => ({
      line,
      index,
      relevance: matchedKeywords.reduce(
        (score, keyword) => score + (normalizeText(line).includes(` ${keyword} `) ? 1 : 0),
        0
      )
    }))
    .filter((item) => item.relevance > 0)
    .sort((left, right) => right.relevance - left.relevance || left.index - right.index)
    .slice(0, 2)
    .map((item) => item.line);
}

export function createCoverLetter({ role, company, resumeText, analysis, name }) {
  const position = role.trim() || "the advertised position";
  const employer = company.trim() || "your team";
  const matchedTerms = analysis?.matched.slice(0, 4) || [];
  const evidence = getResumeEvidence(resumeText, matchedTerms);
  const opening = matchedTerms.length
    ? `My resume includes ${matchedTerms.join(", ")}, which appear in the role description.`
    : "I am interested in learning more about the priorities for this role and how my experience could contribute.";
  const evidenceParagraph = evidence.length
    ? `Relevant experience from my resume includes: ${evidence.join(" ")}`
    : "I would welcome the opportunity to discuss how my experience relates to the work your team is doing.";

  return [
    "Dear Hiring Team,",
    "",
    `I am applying for ${position} at ${employer}.`,
    "",
    opening,
    "",
    evidenceParagraph,
    "",
    "I would welcome a conversation about the role and how I could contribute. Thank you for your time and consideration.",
    "",
    "Sincerely,",
    name.trim() || "[Your name]"
  ].join("\n");
}

export function createRolePrepQuestions({ role, company, resumeText, analysis }) {
  const position = role.trim() || "this role";
  const employer = company.trim() || "the company";
  const matched = analysis.matched.slice(0, 4);
  const missing = analysis.missing.slice(0, 4);
  const evidence = getResumeEvidence(resumeText, matched);
  const questions = [
    {
      id: "role-motivation",
      category: "Role motivation",
      text: `Why are you interested in ${position} at ${employer}, and which responsibilities in the job description fit the work you want to do next?`
    },
    {
      id: "role-priorities",
      category: "Role understanding",
      text: `Based on this job description, what would you want to learn and deliver in your first 90 days in ${position}?`
    },
    {
      id: "resume-evidence",
      category: "Your evidence",
      text: evidence.length
        ? `Which part of this resume experience is most relevant to ${position}, and what did you personally contribute? “${evidence[0]}”`
        : `Which specific project or responsibility best proves you can do ${position}, and what measurable result did you achieve?`
    }
  ];

  const matchedPrompts = matched.length
    ? matched
    : ["the main skills listed in this role"];
  matchedPrompts.slice(0, 4).forEach((keyword, index) => {
    questions.push({
      id: `role-skill-evidence-${index}-${normalizeTerm(keyword)}`,
      category: "Relevant experience",
      text: `The job description emphasizes “${keyword}”. Describe a real example of how you used it, the choices you made, and the outcome.`
    });
  });

  const gapPrompts = missing.length
    ? missing
    : ["a key responsibility in the job description"];
  gapPrompts.slice(0, 4).forEach((keyword, index) => {
    questions.push({
      id: `role-skill-gap-${index}-${normalizeTerm(keyword)}`,
      category: "Honest skill gaps",
      text: `Your resume does not mention “${keyword}”. What related experience or learning can you honestly share, and what practical step would you take to build this skill?`
    });
  });

  [
    ["conflict", "Tell me about a disagreement with a teammate. How did you understand their perspective and reach a workable outcome?"],
    ["deadline", "Describe a time you had competing deadlines. How did you prioritize, communicate risks, and deliver?"],
    ["setback", "Tell me about a project that did not go to plan. What did you do next, and what did you learn?"],
    ["feedback", "What is a piece of constructive feedback that changed how you work? Give a specific example."]
  ].forEach(([id, text]) => questions.push({ id: `role-behavior-${id}`, category: "Behavioral practice", text }));

  return questions;
}

function getRolePrepStorageKey(role, company) {
  const roleKey = normalizeTerm(role).replace(/[^a-z0-9]+/g, "-") || "role";
  const companyKey = normalizeTerm(company).replace(/[^a-z0-9]+/g, "-") || "company";
  return `careeros.rolePrepAnswers.${roleKey}.${companyKey}`;
}

function loadRolePrepAnswers(storageKey) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function CareerStudio({ profile }) {
  const [resumeText, setResumeText] = useState(loadResume);
  const [role, setRole] = useState(profile?.targetRole || "");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [letter, setLetter] = useState(loadLetterDraft);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const prepStorageKey = getRolePrepStorageKey(role, company);
  const [prepAnswers, setPrepAnswers] = useState(() => loadRolePrepAnswers(prepStorageKey));
  const prepQuestions = useMemo(
    () => analysis ? createRolePrepQuestions({ role, company, resumeText, analysis }) : [],
    [analysis, company, resumeText, role]
  );

  useEffect(() => {
    setPrepAnswers(loadRolePrepAnswers(prepStorageKey));
  }, [prepStorageKey]);

  useEffect(() => {
    const syncResume = () => setResumeText(loadResume());
    window.addEventListener("storage", syncResume);
    window.addEventListener("focus", syncResume);
    return () => {
      window.removeEventListener("storage", syncResume);
      window.removeEventListener("focus", syncResume);
    };
  }, []);

  function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!resumeText.trim()) {
      setError("Save your resume text first so the match can compare it with the role.");
      return;
    }
    if (jobDescription.trim().length < 30) {
      setError("Paste a fuller job description (at least 30 characters) for a useful comparison.");
      return;
    }

    const result = analyzeJobMatch(resumeText, jobDescription);
    if (!result.keywordCount) {
      setError("This job description did not contain enough role-specific terms to compare.");
      return;
    }
    setAnalysis(result);
    setNotice("Comparison complete. This is a keyword coverage check, not a hiring prediction.");
  }

  function handleGenerateLetter() {
    if (!analysis) {
      setError("Compare your resume with a job description before drafting a tailored letter.");
      return;
    }
    const draft = createCoverLetter({
      role,
      company,
      resumeText,
      analysis,
      name: profile?.fullName || ""
    });
    try {
      window.localStorage.setItem(LETTER_STORAGE_KEY, draft);
      setError("");
      setNotice("Draft created and saved in this browser. Review it before sending.");
    } catch {
      setError("The draft is ready but could not be saved in this browser. Copy or download it before leaving this page.");
      setNotice("");
    }
    setLetter(draft);
  }

  function handleLetterChange(value) {
    setLetter(value);
    setNotice("");
    try {
      window.localStorage.setItem(LETTER_STORAGE_KEY, value);
      setError("");
    } catch {
      setError("The draft could not be saved in this browser. Copy or download it before leaving this page.");
    }
  }

  function handlePrepAnswerChange(questionId, answer) {
    const updated = { ...prepAnswers, [questionId]: answer };
    setPrepAnswers(updated);
    try {
      window.localStorage.setItem(prepStorageKey, JSON.stringify(updated));
      setError("");
    } catch {
      setError("Practice notes could not be saved in this browser. Copy them before leaving this page.");
    }
  }

  async function handleCopyLetter() {
    try {
      await navigator.clipboard.writeText(letter);
      setNotice("Cover letter copied to your clipboard.");
      setError("");
    } catch {
      setError("Clipboard access was blocked. Select and copy the letter text manually.");
    }
  }

  function handleDownloadLetter() {
    const file = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(company || "cover-letter").trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "cover-letter"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setNotice("Cover letter downloaded as a text file.");
    setError("");
  }

  return (
    <div className="workspace-page career-studio-page">
      <div className="workspace-heading">
        <div>
          <span className="page-eyebrow">Career Studio</span>
          <h1>Career Studio</h1>
          <p>Bring one job description. Leave with a clearer match, stronger examples, and a letter you can edit.</p>
        </div>
        <a className="quiet-link" href="#resume">Edit saved resume ↗</a>
      </div>

      <section className="career-studio-panel" aria-labelledby="job-match-title">
        <div className="career-studio-panel-heading">
          <div>
            <h2 id="job-match-title">Start with the job description</h2>
            <p>Compare the requirements with the wording in your resume. Nothing is uploaded.</p>
          </div>
        </div>
        {!resumeText.trim() && (
          <p className="career-studio-tip">Add your resume on the Resume page first. Your resume stays in this browser.</p>
        )}
        <form className="career-studio-form" onSubmit={handleAnalyze}>
          <div className="career-studio-fields">
            <label className="field">
              <span>Role title</span>
              <input
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setAnalysis(null);
                }}
                maxLength={160}
                placeholder="e.g. Product Analyst"
              />
            </label>
            <label className="field">
              <span>Company</span>
              <input
                value={company}
                onChange={(event) => {
                  setCompany(event.target.value);
                  setAnalysis(null);
                }}
                maxLength={160}
                placeholder="e.g. Northstar Labs"
              />
            </label>
          </div>
          <label className="field">
            <span>Job description</span>
            <textarea
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setAnalysis(null);
              }}
              maxLength={20000}
              minLength={30}
              required
              rows={8}
              placeholder="Paste the full job description, including responsibilities and qualifications."
            />
          </label>
          <div className="career-studio-form-footer">
            <span>Looks for repeated wording only; it does not predict hiring decisions.</span>
            <button className="primary-button" type="submit">Compare resume and role</button>
          </div>
        </form>

        {analysis && (
          <div className="career-match-result" aria-live="polite">
            <div className="career-match-score">
              <strong>{analysis.score}%</strong>
              <span>role terms found</span>
              <small>{analysis.matched.length} of {analysis.keywordCount} repeated terms appear in your resume</small>
            </div>
            <div className="career-match-keywords">
              <div>
                <h3>Found in your resume</h3>
                {analysis.matched.length
                  ? <div className="career-keyword-list">{analysis.matched.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                  : <p>No frequent role terms matched verbatim. Review the role and your experience manually.</p>}
              </div>
              <div>
                <h3>Not found in your resume text</h3>
                {analysis.missing.length
                  ? <div className="career-keyword-list career-keyword-missing">{analysis.missing.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                  : <p>All the frequent terms selected from this description appear in your resume.</p>}
              </div>
            </div>
          </div>
        )}
      </section>

      {analysis && (
        <section className="career-studio-panel" aria-labelledby="role-practice-title">
          <div className="career-studio-panel-heading">
            <div>
              <h2 id="role-practice-title">Prepare examples for the interview</h2>
              <p>{prepQuestions.length} questions connect requirements in the posting to projects and skills in your resume.</p>
            </div>
          </div>
          <p className="career-practice-guidance">For experience questions, prepare the Situation, Task, Action, and Result. For skills missing from the resume, explain your real experience honestly—never claim a skill you do not have.</p>
          <div className="career-role-question-list">
            {prepQuestions.map((question, index) => (
              <article className="career-role-question" key={question.id}>
                <div className="career-role-question-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{question.category}</strong>
                </div>
                <h3>{question.text}</h3>
                <label className="sr-only" htmlFor={`role-answer-${question.id}`}>Practice notes for question {index + 1}</label>
                <textarea
                  id={`role-answer-${question.id}`}
                  rows={3}
                  maxLength={4000}
                  value={prepAnswers[question.id] || ""}
                  onChange={(event) => handlePrepAnswerChange(question.id, event.target.value)}
                  placeholder="Outline your answer. Your notes save in this browser for this role and company."
                />
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="career-studio-panel" aria-labelledby="cover-letter-title">
        <div className="career-studio-panel-heading">
          <div>
            <h2 id="cover-letter-title">Write a first draft</h2>
            <p>Use details from this role and examples already present in your resume. Edit every line before sending.</p>
          </div>
        </div>
        <div className="career-letter-toolbar">
          <button className="primary-button" type="button" onClick={handleGenerateLetter} disabled={!analysis}>
            {letter.trim() ? "Refresh draft" : "Draft from my resume"}
          </button>
          {letter.trim() && (
            <div>
              <button className="secondary-button" type="button" onClick={handleCopyLetter}>Copy</button>
              <button className="secondary-button" type="button" onClick={handleDownloadLetter}>Download .txt</button>
            </div>
          )}
        </div>
        {letter.trim() ? (
          <>
            <label className="sr-only" htmlFor="career-cover-letter">Editable cover letter draft</label>
            <textarea
              id="career-cover-letter"
              className="career-letter-editor"
              value={letter}
              onChange={(event) => handleLetterChange(event.target.value)}
              maxLength={12000}
              rows={14}
            />
          </>
        ) : (
          <div className="career-letter-empty">
            <strong>Your draft will go here</strong>
            <p>Compare your resume with a job description first, then create a draft from your real experience.</p>
          </div>
        )}
        {error && <p className="auth-error" role="alert">{error}</p>}
        {notice && <p className="save-success" role="status">{notice}</p>}
        <p className="career-studio-disclaimer">This tool uses local text matching and your saved resume; it does not send your resume to an AI service or predict hiring outcomes. Always verify the draft before using it.</p>
      </section>
    </div>
  );
}

export default CareerStudio;
