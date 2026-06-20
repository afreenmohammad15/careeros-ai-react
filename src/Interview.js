import React, { useState } from "react";

function Interview() {
  const questions = [
    "Tell me about yourself.",
    "Why do you want this job?",
    "What are your strengths?",
    "What is HTML?",
    "What is the difference between HTML and CSS?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const submitAnswer = () => {
    if (answer.length > 50) {
      setFeedback("✅ Great Answer! Your response looks detailed.");
    } else {
      setFeedback("⚠️ Try writing a longer answer with more details.");
    }
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert("🎉 Interview Completed!");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        padding: "20px",
      }}
    >
      <h1>🎤 AI Mock Interview</h1>

      <h2>{questions[currentQuestion]}</h2>

      <textarea
        rows="6"
        cols="50"
        placeholder="Type your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <br />
      <br />

      <button onClick={submitAnswer}>
        Submit Answer
      </button>

      <br />
      <br />

      <h3>{feedback}</h3>

      <button onClick={nextQuestion}>
        Next Question
      </button>
    </div>
  );
}

export default Interview;