import React, { useState } from "react";

function ResumeUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Resume Upload</h1>

      <input type="file" onChange={handleFileChange} />

      {file && (
        <p>
          Uploaded: <b>{file.name}</b>
        </p>
      )}
    </div>
  );
}

export default ResumeUpload;