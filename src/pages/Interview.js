import React from "react";

function Interview() {

  const questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why do you want to work for our company?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging project you worked on.",
    "How do you handle pressure and deadlines?",
    "What motivates you?",
    "Tell me about a time you solved a difficult problem.",
    "Explain React and its advantages.",
    "What is the Virtual DOM in React?",
    "What are React Hooks?",
    "What is the difference between state and props?",
    "Explain JavaScript ES6 features.",
    "What is asynchronous programming?",
    "What is Git and why is it used?",
    "Describe a team project you worked on.",
    "How do you learn new technologies?",
    "Do you have any questions for us?"
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1>Mock Interview Questions</h1>

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            background: "#f4f4f4",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px"
          }}
        >
          <h3>Q{index + 1}. {q}</h3>
        </div>
      ))}
    </div>
  );
}

export default Interview;