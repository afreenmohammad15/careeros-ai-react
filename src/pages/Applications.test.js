import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Applications, { applicationsToCsv } from "./Applications";
import { addExternalApplication, getMyApplications, updateApplication } from "../services/api";

jest.mock("../services/api", () => ({
  addExternalApplication: jest.fn(),
  getMyApplications: jest.fn(),
  updateApplication: jest.fn()
}));

const exampleApplication = {
  id: 18,
  jobId: null,
  jobTitle: "Frontend Engineer",
  company: "Goodworks",
  status: "APPLIED",
  appliedAt: "2026-10-12T00:00:00",
  followUpDate: null,
  notes: "",
  sourceUrl: "https://example.com/jobs/18",
  updatedAt: "2026-10-12T00:00:00"
};

beforeEach(() => {
  jest.clearAllMocks();
  getMyApplications.mockResolvedValue([exampleApplication]);
});

test("updates a saved application's status and follow-up date", async () => {
  updateApplication.mockResolvedValue({
    ...exampleApplication,
    status: "INTERVIEW",
    followUpDate: "2026-10-20",
    updatedAt: "2026-10-14T00:00:00"
  });
  render(<Applications token="test-token" />);
  expect(screen.getByText(/apply on the employer or job-board website first/i)).toBeInTheDocument();

  fireEvent.change(await screen.findByLabelText("Status"), { target: { value: "INTERVIEW" } });
  fireEvent.change(screen.getByLabelText("Next follow-up"), { target: { value: "2026-10-20" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

  await waitFor(() => expect(updateApplication).toHaveBeenCalledWith("test-token", 18, {
    status: "INTERVIEW",
    appliedAt: "2026-10-12",
    followUpDate: "2026-10-20",
    notes: ""
  }));
  expect(await screen.findByText("Updated Frontend Engineer at Goodworks.")).toBeInTheDocument();
});

test("adds an application submitted outside CareerOS", async () => {
  addExternalApplication.mockResolvedValue({
    ...exampleApplication,
    id: 19,
    jobTitle: "Product Analyst",
    company: "Fieldwork",
    sourceUrl: null
  });
  render(<Applications token="test-token" />);
  fireEvent.click(screen.getByRole("button", { name: /add an application/i }));

  fireEvent.change(screen.getByLabelText("Job title"), { target: { value: "Product Analyst" } });
  fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Fieldwork" } });
  fireEvent.click(screen.getByRole("button", { name: "Add to tracker" }));

  await waitFor(() => expect(addExternalApplication).toHaveBeenCalledWith("test-token", expect.objectContaining({
    jobTitle: "Product Analyst",
    company: "Fieldwork"
  })));
  expect(await screen.findByText("Product Analyst")).toBeInTheDocument();
});

test("exports CSV fields safely, including quotes and spreadsheet formulas", () => {
  expect(applicationsToCsv([{
    ...exampleApplication,
    jobTitle: '=HYPERLINK("https://example.com","click")',
    company: "Goodworks, Inc.",
    notes: "First line\nSecond line"
  }])).toBe([
    '"Job title","Company","Status","Date applied","Next follow-up","Job link","Notes"',
    `"'=HYPERLINK(""https://example.com"",""click"")","Goodworks, Inc.","Applied","2026-10-12","","https://example.com/jobs/18","First line\nSecond line"`
  ].join("\r\n"));
});
