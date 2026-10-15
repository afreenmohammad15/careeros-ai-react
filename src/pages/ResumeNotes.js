import React, { useState } from "react";

const RESUME_STORAGE_KEY = "careeros.resumeText";
const MAX_RESUME_LENGTH = 100000;
const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024;

function loadSavedResume() {
  try {
    return window.localStorage.getItem(RESUME_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function ResumeNotes() {
  const [resumeText, setResumeText] = useState(loadSavedResume);
  const [readingFile, setReadingFile] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState("");
  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  function handleTextChange(event) {
    setResumeText(event.target.value);
    setSaveMessage("");
    setError("");
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_RESUME_FILE_SIZE) {
      setError("This file is too large. Choose a resume under 10 MB.");
      event.target.value = "";
      return;
    }

    setReadingFile(true);
    setError("");
    try {
      const { readResumeFile } = await import("../services/resumeFileReader");
      const text = await readResumeFile(file, MAX_RESUME_LENGTH);
      if (!text.trim()) {
        throw new Error("No selectable text was found. Scanned PDFs need OCR; copy their text into the box instead.");
      }
      if (text.length > MAX_RESUME_LENGTH) {
        throw new Error("The extracted text is over 100 KB. Shorten the resume before using it for practice.");
      }
      setResumeText(text);
      setSaveMessage("");
    } catch (fileError) {
      setError(`The resume could not be read. ${fileError.message || "Try copying and pasting its text instead."}`);
    } finally {
      setReadingFile(false);
      event.target.value = "";
    }
  }

  function handleSave() {
    if (!resumeText.trim()) {
      setError("Add your resume text before saving it.");
      setSaveMessage("");
      return;
    }

    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, resumeText.trim());
      setSaveMessage("Resume saved in this browser. Interview practice will use this text to prepare questions.");
      setError("");
    } catch {
      setError("Your resume could not be saved in this browser. Check your browser’s storage settings and try again.");
      setSaveMessage("");
    }
  }

  function handleClear() {
    try {
      window.localStorage.removeItem(RESUME_STORAGE_KEY);
      setResumeText("");
      setSaveMessage("Resume text removed from this browser.");
      setError("");
    } catch {
      setError("Your saved resume could not be removed. Check your browser’s storage settings and try again.");
    }
  }

  return (
    <div className="resume-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Your experience</span>
          <h1>Resume notes</h1>
          <p>Save your resume text here. Interview practice uses its real projects and skills to build questions.</p>
        </div>
        <a className="quiet-link" href="#career-studio">Match against a job ↗</a>
      </div>

      <section className="resume-editor-card" aria-labelledby="resume-editor-title">
        <div className="resume-editor-heading">
          <div>
            <h2 id="resume-editor-title">Your resume text</h2>
            <p>Upload a text-based PDF, Word document, or text file, or paste the text below. Project descriptions and results make better practice questions.</p>
          </div>
          <span className="resume-word-count">{wordCount} words</span>
        </div>

        <label className="resume-file-picker" htmlFor="resume-text-file">
          <span>{readingFile ? "Reading resume…" : "Choose a resume file"}</span>
          <input id="resume-text-file" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={handleFileChange} disabled={readingFile} />
        </label>

        <label className="sr-only" htmlFor="resume-content">Resume text</label>
        <textarea
          id="resume-content"
          className="resume-text-editor"
          value={resumeText}
          onChange={handleTextChange}
          maxLength={MAX_RESUME_LENGTH}
          placeholder={"Paste your resume here. Include your experience, projects, skills, and outcomes so your practice questions can refer to the work you’ve actually done."}
        />

        <div className="resume-editor-footer">
          <span>Your resume stays in this browser and is used only to prepare your practice questions.</span>
          <div>
            {resumeText && <button className="secondary-button" type="button" onClick={handleClear}>Remove resume</button>}
            <button className="primary-button" type="button" onClick={handleSave}>Save resume</button>
          </div>
        </div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {saveMessage && <p className="save-success" role="status">{saveMessage}</p>}
      </section>
    </div>
  );
}

export default ResumeNotes;
