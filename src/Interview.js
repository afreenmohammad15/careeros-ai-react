import React, { useEffect, useMemo, useState } from "react";

const RESUME_STORAGE_KEY = "careeros.resumeText";
const ANSWERS_STORAGE_KEY = "careeros.interviewAnswers";
const MOCK_INTERVIEW_STORAGE_KEY = "careeros.mockInterview";

const commonQuestions = [
  {
    id: "career-summary",
    category: "Your story",
    text: "Looking at your experience, which piece of work best shows the kind of contribution you want to make next?"
  },
  {
    id: "career-path",
    category: "Your story",
    text: "What should an interviewer understand about your career path that may not be obvious from your resume?"
  },
  {
    id: "challenge",
    category: "Working with others",
    text: "Tell me about a difficult decision you made at work. What options did you consider, and what happened?"
  },
  {
    id: "questions-for-team",
    category: "Questions for the team",
    text: "What would you want to ask the people you would work with before deciding to join?"
  },
  {
    id: "career-transition",
    category: "Your story",
    text: "What is prompting you to explore a new role at this point in your career?"
  },
  {
    id: "career-values",
    category: "Your story",
    text: "What conditions help you do your best work, and how do you know when they are present?"
  },
  {
    id: "strength-proof",
    category: "Your strengths",
    text: "Which strength do colleagues rely on most, and what is one example that demonstrates it?"
  },
  {
    id: "growth-area",
    category: "Your growth",
    text: "What skill are you intentionally improving, and how are you measuring your progress?"
  },
  {
    id: "ambiguity",
    category: "Problem solving",
    text: "Tell me about a time you had to make progress with incomplete information. What did you do first?"
  },
  {
    id: "decision-tradeoff",
    category: "Problem solving",
    text: "Describe a difficult trade-off you made. What options did you consider and what informed your decision?"
  },
  {
    id: "customer-impact",
    category: "Impact",
    text: "How have you used customer or user feedback to change a piece of work?"
  },
  {
    id: "quality",
    category: "How you work",
    text: "How do you check the quality of your work before sharing or shipping it?"
  },
  {
    id: "ownership",
    category: "How you work",
    text: "Tell me about a problem you noticed and addressed before someone asked you to."
  },
  {
    id: "collaboration",
    category: "Working with others",
    text: "Describe how you adapted your communication for people with different priorities or expertise."
  },
  {
    id: "influence",
    category: "Working with others",
    text: "Tell me about a time you had to influence a decision without having formal authority."
  },
  {
    id: "failure-recovery",
    category: "Learning",
    text: "Tell me about a mistake you made at work. How did you address the impact and prevent a repeat?"
  },
  {
    id: "success-measure",
    category: "Impact",
    text: "How do you decide whether a project was successful when the outcome is not captured by one metric?"
  },
  {
    id: "prioritization",
    category: "How you work",
    text: "When everything feels urgent, how do you decide what to do first and explain that choice?"
  },
  {
    id: "learning-example",
    category: "Learning",
    text: "Describe something unfamiliar you had to learn quickly. How did you apply it?"
  },
  {
    id: "manager-expectations",
    category: "Questions for the team",
    text: "What support, feedback, or context helps you succeed when joining a new team?"
  },
  {
    id: "team-culture",
    category: "Questions for the team",
    text: "What team behaviours make collaboration productive for you, especially when people disagree?"
  }
];

const resumeSkills = [
  "stakeholder management", "project management", "product strategy", "user research",
  "machine learning", "customer success", "financial modeling", "data analysis",
  "accessibility", "TypeScript", "JavaScript", "Next.js", "Node.js", "Express",
  "Angular", "React", "Vue", "Python", "Java", "C#", ".NET", "Spring",
  "PostgreSQL", "MongoDB", "MySQL", "GraphQL", "REST APIs", "AWS", "Azure",
  "GCP", "Docker", "Kubernetes", "Figma", "Tableau", "Power BI", "Excel",
  "analytics", "leadership", "Agile", "Scrum", "SEO", "marketing", "sales",
  "communication", "Git"
];

const resumeQuestionThemes = [
  ["Project context", [
    "What need or pain point led you to take on this work?",
    "Who was most affected by the problem you were addressing?",
    "What did you know about the problem before you began?",
    "How did you decide what a successful outcome would look like?",
    "What made this work important compared with other priorities?",
    "Which requirements or constraints shaped the scope?",
    "What was uncertain at the start, and how did you reduce that uncertainty?",
    "What would likely have happened if the problem had not been addressed?",
    "How did you check that your understanding of the need was correct?",
    "What context would an interviewer need to understand this achievement?"
  ]],
  ["Ownership and contribution", [
    "Which deliverable or decision was most clearly yours?",
    "How did your responsibilities change from the beginning to the end?",
    "What did you personally do that moved the work forward?",
    "Which part required the most independent judgement from you?",
    "How would you separate your contribution from the team's contribution?",
    "What did you take responsibility for when the plan changed?",
    "Which decision would not have happened without your involvement?",
    "How did you make sure your work reached the people who needed it?",
    "What feedback did you receive about your contribution?",
    "What would a teammate say you owned particularly well?"
  ]],
  ["Problem solving", [
    "What was the hardest obstacle, and how did you work through it?",
    "What options did you consider before choosing your approach?",
    "Which assumption did you test first, and what did you learn?",
    "How did you decide what to investigate and what to leave aside?",
    "Describe a point where your first approach did not work. What changed?",
    "What trade-off did you make between speed, scope, and quality?",
    "How did you handle incomplete or conflicting information?",
    "What signal told you to change direction?",
    "How did you break a complex part of the work into manageable steps?",
    "If the same obstacle happened again, what would you try first?"
  ]],
  ["Technical and practical choices", [
    "Which technical or practical choice had the greatest effect on the result?",
    "What alternatives did you evaluate, and why did you reject them?",
    "How did you validate that your chosen approach would work?",
    "What limitation or edge case did you need to account for?",
    "How did you balance maintainability with the time available?",
    "Which tools or methods were essential, and why were they appropriate?",
    "What would you change if the workload or user base grew substantially?",
    "How did you make the solution usable for people with different needs?",
    "What risk did your approach introduce, and how did you manage it?",
    "How would you explain the key design choice to a non-specialist?"
  ]],
  ["Collaboration", [
    "Who did you need to involve for this work to succeed?",
    "How did you resolve a disagreement about the right approach?",
    "What dependency on another person or team did you have to manage?",
    "How did you adapt your communication for different audiences?",
    "When did feedback from someone else change your approach?",
    "How did you keep collaborators informed as the work progressed?",
    "What did you do when priorities across the team conflicted?",
    "How did you make sure quieter or less-represented perspectives were heard?",
    "What would you do differently to make the collaboration smoother?",
    "How did you help another person contribute effectively?"
  ]],
  ["Impact and evidence", [
    "What changed for users, customers, or the business after this work?",
    "How was the result measured, and what was your evidence?",
    "What does the number or outcome on your resume mean in practical terms?",
    "How did you know the change came from this work rather than another factor?",
    "Which outcome mattered most to the people affected?",
    "Was there an unexpected result, positive or negative?",
    "How long did the improvement last, and how was that checked?",
    "What evidence would you gather now to make the impact more convincing?",
    "How did you communicate the result to decision-makers?",
    "What follow-on opportunity did this outcome create?"
  ]],
  ["Quality and measurement", [
    "What checks did you use before considering the work complete?",
    "How did you catch errors or gaps before they affected others?",
    "What baseline did you compare the result against?",
    "Which metric was most useful, and what did it fail to show?",
    "How did you get feedback from the people using the result?",
    "What would have caused you to roll back or stop the work?",
    "How did you make the result repeatable or easy to verify?",
    "What quality issue did you discover late, and how did you respond?",
    "How did you balance thoroughness with delivery deadlines?",
    "What would you monitor if this work continued in production?"
  ]],
  ["Learning and reflection", [
    "What is the most important thing you learned by doing this work?",
    "What would you do differently if you could start again?",
    "Which skill improved the most through this experience?",
    "What mistake or setback changed the way you work?",
    "What feedback did you act on, and what changed as a result?",
    "Which part of the work would you now approach with more caution?",
    "What did this experience teach you about your working style?",
    "What knowledge would have made the work easier at the time?",
    "How have you used this learning in a later project?",
    "What question about this experience are you still thinking through?"
  ]],
  ["Planning and delivery", [
    "How did you break the work into milestones?",
    "What did you prioritise when time or resources were limited?",
    "How did you identify risks before they became blockers?",
    "What changed in the plan, and how did you reset expectations?",
    "How did you keep the work moving when a dependency was delayed?",
    "What did you decide not to do, and why?",
    "How did you estimate the effort or timeline?",
    "What was the most useful early milestone or quick test?",
    "How did you keep delivery on track without sacrificing quality?",
    "What would you plan differently if you owned the work again?"
  ]],
  ["Role readiness", [
    "Which capability from this experience would transfer most directly to your target role?",
    "What part of this work best demonstrates your readiness for greater responsibility?",
    "How would you apply this experience to a new team or industry?",
    "What would you need to learn before doing similar work at larger scale?",
    "Which result from this work would you lead with in an interview, and why?",
    "How does this experience connect to the kind of work you want next?",
    "What would you want your next manager to know about your contribution here?",
    "How could you build on this work in your first 90 days in a new role?",
    "What follow-up question do you expect an interviewer to ask about this item?",
    "Give a concise two-minute explanation of this work and its outcome."
  ]]
];

function loadResumeText() {
  try {
    return window.localStorage.getItem(RESUME_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function loadSavedAnswers() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ANSWERS_STORAGE_KEY) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function loadMockInterview() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(MOCK_INTERVIEW_STORAGE_KEY) || "null");
    if (
      !saved
      || !Array.isArray(saved.questionIds)
      || saved.questionIds.length !== 10
      || !saved.questionIds.every((id) => typeof id === "string")
      || !Number.isInteger(saved.currentIndex)
      || saved.currentIndex < 0
      || saved.currentIndex > saved.questionIds.length
    ) return null;
    return {
      questionIds: saved.questionIds,
      currentIndex: saved.currentIndex,
      ratings: saved.ratings && typeof saved.ratings === "object" && !Array.isArray(saved.ratings)
        ? saved.ratings
        : {}
    };
  } catch {
    return null;
  }
}

export function createInterviewPrepNotes(questions, answers) {
  const answered = questions.filter((question) => String(answers[question.id] || "").trim());
  return [
    "CareerOS interview preparation notes",
    `Exported ${new Date().toLocaleDateString()}`,
    "",
    ...answered.flatMap((question) => [
      `[${question.category}] ${question.text}`,
      String(answers[question.id]).trim(),
      ""
    ])
  ].join("\n");
}

function extractResumeHighlights(resumeText) {
  return resumeText
    .split(/\r?\n/)
    .flatMap((line) => line.trim() ? [line] : [])
    .flatMap((line) => {
      const cleaned = line.replace(/^\s*(?:[-*•▪]|\d+[.)])\s*/, "").replace(/\s+/g, " ").trim();
      if (!resumeText.includes("\n")) {
        return (cleaned.match(/[^.!?]+[.!?]?/g) || [])
          .map((sentence) => sentence.trim())
          .filter((sentence) => sentence.length >= 35);
      }
      if (cleaned.length >= 35) return [cleaned];
      return [];
    })
    .filter((line) => line.length <= 320 && !/@|https?:\/\//i.test(line))
    .filter((line, index, lines) => lines.findIndex((other) => other.toLowerCase() === line.toLowerCase()) === index);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createInterviewQuestions(resumeText, targetRole = "") {
  const questions = [];
  const highlights = extractResumeHighlights(resumeText);
  const resumeEvidence = highlights.length
    ? highlights
    : resumeText.trim()
      ? [resumeText.trim().replace(/\s+/g, " ").slice(0, 320)]
      : [];

  if (resumeEvidence.length) {
    resumeQuestionThemes.forEach(([category, prompts], themeIndex) => {
      prompts.forEach((prompt, promptIndex) => {
        const questionIndex = themeIndex * prompts.length + promptIndex;
        const highlight = resumeEvidence[questionIndex % resumeEvidence.length];
        const evidence = `“${highlight}”`;
        const punctuation = /[.!?]$/.test(highlight) ? "" : ".";
        const highlightKey = highlight.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
        questions.push({
          id: `resume-deep-dive-${questionIndex}-${highlightKey}`,
          category,
          text: `Your resume states: ${evidence}${punctuation} ${prompt}`
        });
      });
    });
  }

  const matchedSkills = resumeSkills
    .filter((skill) => new RegExp(`(^|[^a-z0-9])${escapeRegExp(skill)}($|[^a-z0-9])`, "i").test(resumeText))
    .sort((left, right) => right.length - left.length)
    .filter((skill, index, skills) => !skills.slice(0, index).some((matched) => matched.toLowerCase().includes(skill.toLowerCase())));

  matchedSkills.forEach((skill) => {
    const skillId = skill.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    [
      ["example", `You list ${skill} on your resume. Describe a specific time you used it, the problem you faced, and the outcome.`],
      ["choices", `For a project using ${skill}, what alternatives did you consider and why did you choose your approach?`],
      ["depth", `How would you explain a key ${skill} concept or quality trade-off to a teammate, using an example from your work?`]
    ].forEach(([type, text]) => {
      questions.push({
        id: `resume-skill-${skillId}-${type}`,
        category: "Skills from your resume",
        text
      });
    });
  });

  if (targetRole.trim()) {
    [
      ["evidence", `You are aiming for ${targetRole.trim()}. Which experience on your resume is the strongest evidence that you are ready for this role?`],
      ["growth", `For a ${targetRole.trim()} role, what is one area you are still developing, and what have you done to improve it?`],
      ["priorities", `In a ${targetRole.trim()} role, how would you decide what to learn and deliver in your first 90 days?`],
      ["impact", `What meaningful outcome would you aim to create in your next ${targetRole.trim()} role, and how would you measure it?`],
      ["challenge", `What do you expect to find most challenging in your next ${targetRole.trim()} role, and how would you prepare?`],
      ["value", `What perspective or experience would you bring to a ${targetRole.trim()} team that is distinctive to you?`]
    ].forEach(([type, text]) => questions.push({
      id: `target-role-${type}`,
      category: "Your next role",
      text
    }));
  }

  return [...questions, ...commonQuestions];
}

function Interview({ profile }) {
  const [resumeText, setResumeText] = useState(loadResumeText);
  const [answers, setAnswers] = useState(loadSavedAnswers);
  const [practiceSession, setPracticeSession] = useState(loadMockInterview);
  const [storageError, setStorageError] = useState("");
  const [questionSearch, setQuestionSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
      setStorageError("");
    } catch {
      setStorageError("Your answers could not be saved in this browser. Check your browser’s storage settings.");
    }
  }, [answers]);

  useEffect(() => {
    try {
      if (practiceSession) {
        window.localStorage.setItem(MOCK_INTERVIEW_STORAGE_KEY, JSON.stringify(practiceSession));
      } else {
        window.localStorage.removeItem(MOCK_INTERVIEW_STORAGE_KEY);
      }
    } catch {
      setStorageError("Your mock interview progress could not be saved in this browser.");
    }
  }, [practiceSession]);

  useEffect(() => {
    function syncResume() {
      setResumeText(loadResumeText());
    }
    window.addEventListener("storage", syncResume);
    window.addEventListener("focus", syncResume);
    return () => {
      window.removeEventListener("storage", syncResume);
      window.removeEventListener("focus", syncResume);
    };
  }, []);

  const questions = useMemo(
    () => createInterviewQuestions(resumeText, profile?.targetRole || ""),
    [profile?.targetRole, resumeText]
  );
  const questionById = useMemo(
    () => new Map(questions.map((question) => [question.id, question])),
    [questions]
  );
  const activeSessionQuestion = practiceSession
    ? questionById.get(practiceSession.questionIds[practiceSession.currentIndex])
    : null;
  const questionCategories = useMemo(
    () => [...new Set(questions.map((question) => question.category))],
    [questions]
  );
  const filteredQuestions = useMemo(() => {
    const search = questionSearch.trim().toLowerCase();
    return questions.filter((question) =>
      (categoryFilter === "ALL" || question.category === categoryFilter)
      && (!unansweredOnly || !String(answers[question.id] || "").trim())
      && (!search || question.text.toLowerCase().includes(search))
    );
  }, [answers, categoryFilter, questionSearch, questions, unansweredOnly]);
  const pageSize = 10;
  const pageCount = Math.ceil(filteredQuestions.length / pageSize);
  const pageQuestions = filteredQuestions.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const answeredCount = questions.filter((question) => String(answers[question.id] || "").trim()).length;
  const sessionRatings = practiceSession
    ? Object.values(practiceSession.ratings).map(Number).filter((rating) => rating >= 1 && rating <= 5)
    : [];
  const averageSessionRating = sessionRatings.length
    ? (sessionRatings.reduce((total, rating) => total + rating, 0) / sessionRatings.length).toFixed(1)
    : null;
  const resumeQuestionCount = questions.filter((question) =>
    question.id.startsWith("resume-deep-dive-") || question.category === "Skills from your resume"
  ).length;

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  function updateAnswer(questionId, answer) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
  }

  function resetQuestionPage(updateFilter) {
    updateFilter();
    setCurrentPage(0);
  }

  function startMockInterview() {
    const sessionQuestions = questions.filter((question) => question.id.startsWith("resume-deep-dive-"));
    for (let index = sessionQuestions.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [sessionQuestions[index], sessionQuestions[swapIndex]] = [sessionQuestions[swapIndex], sessionQuestions[index]];
    }
    setPracticeSession({
      questionIds: sessionQuestions.slice(0, 10).map((question) => question.id),
      currentIndex: 0,
      ratings: {}
    });
    setStorageError("");
  }

  function setSessionRating(rating) {
    setPracticeSession((current) => {
      if (!current) return current;
      const questionId = current.questionIds[current.currentIndex];
      return { ...current, ratings: { ...current.ratings, [questionId]: rating } };
    });
  }

  function downloadAnsweredNotes() {
    try {
      const file = new Blob([createInterviewPrepNotes(questions, answers)], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "careeros-interview-prep.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setStorageError("");
    } catch {
      setStorageError("Your interview notes could not be exported. Try again or copy your answers manually.");
    }
  }

  return (
    <div className="interview-page">
      <div className="page-header interview-page-header">
        <div>
          <span className="page-eyebrow">Practice in your own words</span>
          <h1>Interview questions</h1>
          <p>Use your own experience to prepare answers you can stand behind.</p>
        </div>
        {resumeText.trim() && (
          <div className="interview-header-actions">
            <a className="secondary-button" href="#resume">Edit resume text</a>
            <button className="secondary-button" type="button" onClick={downloadAnsweredNotes} disabled={!answeredCount}>
              Download answered notes
            </button>
            {!practiceSession && (
              <button className="primary-button" type="button" onClick={startMockInterview}>
                Start 10-question mock interview
              </button>
            )}
          </div>
        )}
      </div>

      {!resumeText.trim() ? (
        <section className="interview-empty-state">
          <span className="interview-step-number">01</span>
          <div>
            <h2>Start with your resume</h2>
            <p>Add your resume text first. Questions will refer to the projects and skills you include, rather than a preset list.</p>
            <a href="#resume" className="primary-button">Add resume text</a>
          </div>
        </section>
      ) : (
        <>
          <section className="interview-progress" aria-label="Practice progress">
            <div>
              <span>QUESTIONS TO PRACTISE</span>
              <strong>{questions.length}</strong>
            </div>
            <div>
              <span>ANSWERS YOU’VE STARTED</span>
              <strong>{answeredCount} of {questions.length}</strong>
            </div>
            <p>{resumeQuestionCount} prompts are based directly on your resume. Your answers are saved in this browser.</p>
          </section>

          {storageError && <p className="auth-error" role="alert">{storageError}</p>}

          {practiceSession && (
            <section className="mock-interview-session" aria-label="Mock interview session">
              {practiceSession.currentIndex >= practiceSession.questionIds.length ? (
                <>
                  <span className="section-kicker">SESSION COMPLETE</span>
                  <h2>You completed your 10-question practice</h2>
                  <p>
                    Notes saved for {practiceSession.questionIds.filter((id) => String(answers[id] || "").trim()).length} answers.
                    {" "}{averageSessionRating
                      ? `Average self-rating: ${averageSessionRating}/5 across ${sessionRatings.length} rated answers.`
                      : "You did not rate any answers this session."}
                  </p>
                  <div className="mock-interview-actions">
                    <button className="secondary-button" type="button" onClick={() => setPracticeSession(null)}>Return to question bank</button>
                    <button className="primary-button" type="button" onClick={startMockInterview}>Start another set</button>
                  </div>
                </>
              ) : activeSessionQuestion ? (
                <>
                  <div className="mock-interview-heading">
                    <div>
                      <span className="section-kicker">MOCK INTERVIEW</span>
                      <h2>Question {practiceSession.currentIndex + 1} of {practiceSession.questionIds.length}</h2>
                    </div>
                    <span className="interview-question-category">{activeSessionQuestion.category}</span>
                  </div>
                  <p className="mock-interview-prompt">{activeSessionQuestion.text}</p>
                  <label className="field" htmlFor={`mock-answer-${activeSessionQuestion.id}`}>Your answer notes</label>
                  <textarea
                    id={`mock-answer-${activeSessionQuestion.id}`}
                    value={answers[activeSessionQuestion.id] || ""}
                    onChange={(event) => updateAnswer(activeSessionQuestion.id, event.target.value)}
                    placeholder="Answer aloud or outline your response here. Use a specific example and explain your own contribution."
                  />
                  <label className="field" htmlFor="mock-confidence">How confident are you in this answer?</label>
                  <select
                    id="mock-confidence"
                    value={practiceSession.ratings[activeSessionQuestion.id] || ""}
                    onChange={(event) => setSessionRating(event.target.value)}
                  >
                    <option value="">Choose a self-rating</option>
                    <option value="1">1 — Needs work</option>
                    <option value="2">2 — Building</option>
                    <option value="3">3 — Ready with practice</option>
                    <option value="4">4 — Confident</option>
                    <option value="5">5 — Interview ready</option>
                  </select>
                  <div className="mock-interview-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => setPracticeSession((current) => ({ ...current, currentIndex: Math.max(0, current.currentIndex - 1) }))}
                      disabled={practiceSession.currentIndex === 0}
                    >
                      Previous question
                    </button>
                    <span>{practiceSession.currentIndex + 1} / {practiceSession.questionIds.length}</span>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => setPracticeSession((current) => ({ ...current, currentIndex: current.currentIndex + 1 }))}
                    >
                      {practiceSession.currentIndex === practiceSession.questionIds.length - 1 ? "Finish session" : "Next question"}
                    </button>
                    <button className="quiet-link" type="button" onClick={() => setPracticeSession(null)}>End session</button>
                  </div>
                </>
              ) : (
                <>
                  <h2>Your resume changed during this mock interview</h2>
                  <p>Start a fresh set to use the updated resume-based questions.</p>
                  <button className="primary-button" type="button" onClick={startMockInterview}>Restart mock interview</button>
                </>
              )}
            </section>
          )}

          <section className="interview-question-tools" aria-label="Find interview questions">
            <label className="field">
              <span>Search questions</span>
              <input
                type="search"
                value={questionSearch}
                onChange={(event) => resetQuestionPage(() => setQuestionSearch(event.target.value))}
                placeholder="Search your projects, skills, or topics"
              />
            </label>
            <label className="field">
              <span>Question category</span>
              <select
                value={categoryFilter}
                onChange={(event) => resetQuestionPage(() => setCategoryFilter(event.target.value))}
              >
                <option value="ALL">All categories</option>
                {questionCategories.map((category) => <option value={category} key={category}>{category}</option>)}
              </select>
            </label>
            <label className="interview-unanswered-filter">
              <input
                type="checkbox"
                checked={unansweredOnly}
                onChange={(event) => resetQuestionPage(() => setUnansweredOnly(event.target.checked))}
              />
              <span>Only questions without notes</span>
            </label>
            <p className="interview-results-count">
              {filteredQuestions.length
                ? `Showing ${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, filteredQuestions.length)} of ${filteredQuestions.length}`
                : "No questions match these filters"}
            </p>
          </section>

          <div className="interview-question-list">
            {pageQuestions.map((question, index) => {
              const answered = Boolean(String(answers[question.id] || "").trim());
              return (
                <article className="interview-question" key={question.id}>
                  <div className="interview-question-heading">
                    <span className="interview-question-index">{String(currentPage * pageSize + index + 1).padStart(2, "0")}</span>
                    <span className="interview-question-category">{question.category}</span>
                    {answered && <span className="interview-answered">Answer started</span>}
                  </div>
                  <h2>{question.text}</h2>
                  <label htmlFor={`answer-${question.id}`}>Your notes</label>
                  <textarea
                    id={`answer-${question.id}`}
                    value={answers[question.id] || ""}
                    onChange={(event) => updateAnswer(question.id, event.target.value)}
                    placeholder="Write a few notes or draft a full answer. You can come back to it later."
                  />
                  <p className="interview-answer-hint">A useful structure: what was happening, what you did, and what changed.</p>
                </article>
              );
            })}
          </div>
          {pageCount > 1 && (
            <nav className="interview-pagination" aria-label="Interview question pages">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                disabled={currentPage === 0}
              >
                Previous 10
              </button>
              <span>Page {currentPage + 1} of {pageCount}</span>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))}
                disabled={currentPage >= pageCount - 1}
              >
                Next 10
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default Interview;
