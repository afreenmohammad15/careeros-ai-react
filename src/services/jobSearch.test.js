import { buildJobSearchLinks } from "./jobSearch";

test("builds India-localized job searches for real job boards", () => {
  const links = buildJobSearchLinks("Frontend Developer", "Bengaluru", "Internship");

  expect(links.map((link) => link.name)).toEqual([
    "LinkedIn",
    "Naukri",
    "Indeed India",
    "Foundit",
    "Wellfound"
  ]);
  expect(links[0].url).toContain("keywords=Frontend%20Developer%20Internship");
  expect(links[0].url).toContain("location=Bengaluru");
  expect(links[1].url).toBe("https://www.naukri.com/frontend-developer-internship-jobs-in-bengaluru");
  expect(links[2].url).toContain("in.indeed.com/jobs?q=Frontend%20Developer%20Internship");
  expect(links.every((link) => link.url.startsWith("https://"))).toBe(true);
});

test("keeps empty searches valid and does not generate malformed job-board URLs", () => {
  const links = buildJobSearchLinks("", "", "Any role");

  expect(links[0].url).toContain("keywords=jobs");
  expect(links[1].url).toBe("https://www.naukri.com/jobs-in-india");
  expect(links.every((link) => !link.url.includes("/-jobs"))).toBe(true);
});
