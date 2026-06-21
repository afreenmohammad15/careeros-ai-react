import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./Login";
import Dashboard from "./Dashboard";

import ResumeUpload from "./pages/ResumeUpload";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Interview from "./pages/Interview";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/resume-upload"
          element={<ResumeUpload />}
        />

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />

        <Route
          path="/interview"
          element={<Interview />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;