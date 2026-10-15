import { fireEvent, render, screen } from "@testing-library/react";
import Interview, { createInterviewPrepNotes, createInterviewQuestions } from "./Interview";

const resumeQuestionCategories = [
  "Project context", "Ownership and contribution", "Problem solving", "Technical and practical choices",
  "Collaboration", "Impact and evidence", "Quality and measurement", "Learning and reflection",
  "Planning and delivery", "Role readiness"
];

beforeEach(() => {
  window.localStorage.clear();
});

test("builds at least 100 questions anchored to resume projects, skills, and a target role", () => {
  const resume = [
    "Built a React and TypeScript onboarding dashboard that reduced application processing time by 32 percent.",
    "Led a cross-functional launch with product and support teams, increasing customer retention across three regions."
  ].join("\n");

  const questions = createInterviewQuestions(resume, "Frontend Engineer");
  const resumeQuestions = questions.filter((question) => question.id.startsWith("resume-deep-dive-"));
  const skillQuestions = questions.filter((question) => question.category === "Skills from your resume");

  expect(resumeQuestions).toHaveLength(100);
  expect(resumeQuestionCategories.every((category) =>
    resumeQuestions.filter((question) => question.category === category).length === 10
  )).toBe(true);
  expect(resumeQuestions.every((question) => [
    "Built a React and TypeScript onboarding dashboard that reduced application processing time by 32 percent.",
    "Led a cross-functional launch with product and support teams, increasing customer retention across three regions."
  ].some((highlight) => question.text.includes(highlight)))).toBe(true);
  expect(new Set(resumeQuestions.map((question) => question.text)).size).toBe(100);
  expect(skillQuestions.map((question) => question.text)).toEqual(expect.arrayContaining([
    expect.stringContaining("React"),
    expect.stringContaining("TypeScript")
  ]));
  expect(skillQuestions).toHaveLength(6);
  expect(questions.filter((question) => question.category === "Your next role")).toHaveLength(6);
  expect(questions.filter((question) => question.category === "Questions for the team")).toHaveLength(3);
  expect(questions.length).toBeGreaterThanOrEqual(100);
  expect(resumeQuestions[0].text).toContain("onboarding dashboard");
});

test("still creates 100 resume-anchored questions from a short resume", () => {
  const questions = createInterviewQuestions("React\nTypeScript");
  expect(questions.filter((question) => question.category === "Project context")).toHaveLength(10);
  expect(questions.filter((question) => question.category === "Role readiness")).toHaveLength(10);
  expect(questions.filter((question) => question.id.startsWith("resume-deep-dive-"))).toHaveLength(100);
  expect(questions[0].text).toContain("React TypeScript");
  expect(questions.filter((question) => question.category === "Skills from your resume")).toHaveLength(6);
});

test("supports question-bank pagination, search, and unanswered filtering", () => {
  window.localStorage.setItem("careeros.resumeText", "Built a React and TypeScript onboarding dashboard that reduced application processing time by 32 percent.");
  render(<Interview profile={{ targetRole: "Frontend Engineer" }} />);

  expect(screen.getByText(/Showing 1–10 of/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next 10" }));
  expect(screen.getByText(/Showing 11–20 of/)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Search questions"), { target: { value: "TypeScript" } });
  expect(screen.getByText(/Showing 1–/)).toBeInTheDocument();
  expect(screen.getAllByText(/TypeScript/).length).toBeGreaterThan(0);

  const questionHeadings = screen.getAllByRole("heading", { level: 2 });
  const firstQuestion = questionHeadings[0].textContent;
  fireEvent.change(screen.getAllByLabelText("Your notes")[0], { target: { value: "Prepared example" } });
  fireEvent.click(screen.getByLabelText("Only questions without notes"));
  expect(screen.getByText(/Showing 1–/)).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: firstQuestion })).not.toBeInTheDocument();
  expect(window.localStorage.getItem("careeros.interviewAnswers")).toContain("Prepared example");
});

test("starts and saves progress in a resume-based mock interview", () => {
  window.localStorage.setItem("careeros.resumeText", "Built a React dashboard that cut reporting time by 32 percent.");
  render(<Interview profile={{ targetRole: "Frontend Engineer" }} />);

  fireEvent.click(screen.getByRole("button", { name: "Start 10-question mock interview" }));
  expect(screen.getByRole("heading", { name: "Question 1 of 10" })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Your answer notes"), { target: { value: "I built the dashboard and measured reporting time." } });
  fireEvent.change(screen.getByLabelText("How confident are you in this answer?"), { target: { value: "4" } });
  fireEvent.click(screen.getByRole("button", { name: "Next question" }));

  expect(screen.getByRole("heading", { name: "Question 2 of 10" })).toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem("careeros.mockInterview")).currentIndex).toBe(1);
  expect(window.localStorage.getItem("careeros.interviewAnswers")).toContain("I built the dashboard");

  fireEvent.click(screen.getByRole("button", { name: "Previous question" }));
  expect(screen.getByRole("heading", { name: "Question 1 of 10" })).toBeInTheDocument();
  expect(screen.getByLabelText("How confident are you in this answer?")).toHaveValue("4");
});

test("exports answered questions and notes as a readable prep document", () => {
  const questions = [
    { id: "answered", category: "Impact", text: "What changed in this project?" },
    { id: "empty", category: "Learning", text: "What did you learn?" }
  ];

  const notes = createInterviewPrepNotes(questions, { answered: "Reporting time fell by 32%." });

  expect(notes).toContain("[Impact] What changed in this project?");
  expect(notes).toContain("Reporting time fell by 32%.");
  expect(notes).not.toContain("What did you learn?");
});
