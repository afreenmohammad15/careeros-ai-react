import { fireEvent, render, screen } from "@testing-library/react";
import CareerStudio, { analyzeJobMatch, createCoverLetter, createRolePrepQuestions } from "./CareerStudio";

const resumeText = [
  "Frontend engineer experienced in React, TypeScript, and data visualization.",
  "Built accessible dashboards in React that improved reporting speed for product teams."
].join("\n");

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem("careeros.resumeText", resumeText);
});

test("compares exact job-description terms with saved resume text", () => {
  const result = analyzeJobMatch(
    resumeText,
    "The role needs React React TypeScript Python cloud security reporting and stakeholder collaboration."
  );

  expect(result.matched).toEqual(expect.arrayContaining(["react", "typescript", "reporting"]));
  expect(result.missing).toEqual(expect.arrayContaining(["python", "cloud", "security", "stakeholder"]));
  expect(result.score).toBeLessThan(100);
  expect(result.score).toBeGreaterThan(0);
});

test("drafts a role-specific letter using evidence actually present in the resume", () => {
  const analysis = analyzeJobMatch(
    resumeText,
    "Seeking a React engineer with TypeScript and reporting experience."
  );
  const draft = createCoverLetter({
    role: "Frontend Engineer",
    company: "Northstar Labs",
    resumeText,
    analysis,
    name: "Avery"
  });

  expect(draft).toContain("Frontend Engineer at Northstar Labs");
  expect(draft).toContain("Avery");
  expect(draft).toContain("Built accessible dashboards in React");
});

test("creates job-description-specific interview questions and honest gap prompts", () => {
  const analysis = analyzeJobMatch(
    resumeText,
    "Seeking a React engineer with TypeScript, reporting, Python, cloud security and stakeholder management."
  );
  const questions = createRolePrepQuestions({
    role: "Frontend Engineer",
    company: "Northstar Labs",
    resumeText,
    analysis
  });

  expect(questions.length).toBeGreaterThan(10);
  expect(questions.some((question) => question.text.includes("Northstar Labs"))).toBe(true);
  expect(questions.some((question) => question.text.toLowerCase().includes("react"))).toBe(true);
  expect(questions.some((question) => question.text.includes("does not mention"))).toBe(true);
});

test("shows job match results and creates an editable cover-letter draft", () => {
  render(<CareerStudio profile={{ targetRole: "Frontend Engineer", fullName: "Avery" }} />);

  fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Northstar Labs" } });
  fireEvent.change(screen.getByLabelText("Job description"), {
    target: { value: "Seeking a React engineer with TypeScript and reporting experience for product dashboards." }
  });

  expect(screen.getByText("Your draft will go here")).toBeInTheDocument();
  expect(screen.queryByLabelText("Editable cover letter draft")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Compare resume and role" }));

  expect(screen.getByText("role terms found")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Draft from my resume" }));

  const letter = screen.getByLabelText("Editable cover letter draft");
  expect(letter.value).toContain("Frontend Engineer at Northstar Labs");
  expect(letter.value).toContain("Avery");
  expect(window.localStorage.getItem("careeros.coverLetterDraft")).toContain("Northstar Labs");
});
