# CareerOS frontend

The React client is a candidate-focused workspace for job applications, resume notes, interview practice, and role-specific preparation. See the [repository README](../README.md) for features and setup instructions.

PDF, Word, and text resumes are read in the browser. Interview practice creates at least 100 prompts that quote resume experience, with additional questions for detected skills and the target role. Search, category filters, unanswered-only filtering, ten-question pages, and saved answer notes help manage the question bank. A 10-question mock interview saves its progress and confidence ratings locally; answered notes can be downloaded as a preparation document. Resume text, interview answers, resume-to-role keyword comparisons, and editable cover letters are handled locally; no external service receives the resume.

The account-backed tracker records applications submitted on other job sites, including application date, stage, notes, source link, and follow-up date. Export all applications or the current filtered view to CSV.

The job-search page opens current India/city-specific searches on LinkedIn, Naukri, Indeed India, Foundit, and Wellfound. CareerOS does not copy stale listings or submit applications; use the tracker to record roles after applying on the employer or job-board website.

## Run the frontend

```powershell
npm install
npm start
```

The frontend uses `http://localhost:8080` as its backend API by default. Set `REACT_APP_API_URL` before starting the development server if the API is hosted elsewhere.

## Validate changes

```powershell
npm test -- --watchAll=false
npm run build
```
