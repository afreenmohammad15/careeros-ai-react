const JOB_SOURCES = [
  {
    name: "LinkedIn",
    description: "Company and recruiter postings",
    buildUrl: (query, location) => `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${location}`
  },
  {
    name: "Naukri",
    description: "India-focused company listings",
    buildUrl: (query, location) => `https://www.naukri.com/${query}-jobs-in-${location}`
  },
  {
    name: "Indeed India",
    description: "Full-time, part-time, and fresher roles",
    buildUrl: (query, location) => `https://in.indeed.com/jobs?q=${query}&l=${location}`
  },
  {
    name: "Foundit",
    description: "Jobs and internships across India",
    buildUrl: (query, location) => `https://www.foundit.in/search/${query}-jobs?locations=${location}`
  },
  {
    name: "Wellfound",
    description: "Startup roles and early-stage teams",
    buildUrl: (query, location) => `https://wellfound.com/jobs?role=${query}&location=${location}`
  }
];

export const PENDING_JOB_SEARCH_KEY = "careeros.pendingJobSearch";

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildJobSearchLinks(role, location = "India", employmentType = "Any role") {
  const searchTerms = [role.trim() || "jobs", employmentType === "Any role" ? "" : employmentType]
    .filter(Boolean)
    .join(" ");
  const query = encodeURIComponent(searchTerms);
  const locationQuery = encodeURIComponent(location.trim() || "India");
  const roleSlug = slugify(searchTerms);
  const locationSlug = slugify(location.trim() || "India");

  return JOB_SOURCES.map((source) => ({
    name: source.name,
    description: source.description,
    url: source.name === "Naukri"
      ? roleSlug === "jobs"
        ? `https://www.naukri.com/jobs-in-${locationSlug}`
        : source.buildUrl(roleSlug, locationSlug)
      : source.buildUrl(query, locationQuery)
  }));
}

export const roleSuggestions = [
  "Software Engineer",
  "Frontend Developer",
  "Data Analyst",
  "Product Manager",
  "UI/UX Designer",
  "Digital Marketing",
  "Customer Support",
  "Finance Analyst",
  "HR Executive",
  "Internship"
];
