import React, { useCallback, useEffect, useState } from "react";

import Home from "./pages/Home";
import ResumeNotes from "./pages/ResumeNotes";
import Interview from "./Interview";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Applications from "./pages/Applications";
import CareerStudio from "./pages/CareerStudio";
import Jobs from "./pages/Jobs";
import { getProfile, login, register, updateProfile } from "./services/api";

import "./App.css";

function getStoredValue(key) {
  return window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
}

function getRouteFromHash() {
  const hash = window.location.hash.slice(1);
  if (hash === "platform") return "dashboard";
  if (["login", "signup", "dashboard", "resume", "resume-analysis", "interview", "jobs", "applications", "career-studio"].includes(hash)) {
    return hash;
  }
  return "home";
}

function AppShell({ children, user, route, onLogout }) {
  const mainNav = [
    { label: "Overview", route: "dashboard" },
    { label: "Discover roles", route: "jobs" },
    { label: "Applications", route: "applications" },
    { label: "Resume", route: "resume" },
    { label: "Interview practice", route: "interview" },
    { label: "Career Studio", route: "career-studio" }
  ];
  const initials = (user.name || user.email || "CareerOS")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">C</div>
          <div>
            <p className="eyebrow">Job search workspace</p>
            <h2>CareerOS AI</h2>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          {mainNav.map((item) => (
            <a
              key={item.route}
              href={`#${item.route}`}
              className={`nav-item${route === item.route ? " active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="#dashboard" className="nav-item secondary">Your profile</a>
          <button type="button" className="nav-item secondary nav-button" onClick={onLogout}>Sign out</button>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <a className="topbar-search" href="#jobs">
            <span aria-hidden="true">⌕</span>
            <span>Search live jobs in India</span>
          </a>

          <div className="topbar-actions">
            <div className="user-pill">
              <div className="avatar">{initials}</div>
              <div>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <aside className="auth-story">
        <div className="public-brand" aria-label="CareerOS AI">
          <span className="brand-mark">C</span>
          <span>career<span className="brand-accent">OS</span></span>
        </div>
        <div className="auth-story-copy">
          <span className="section-kicker">CAREEROS / YOUR JOB SEARCH</span>
          <h2>Keep the important details in one place.</h2>
          <p>Track the roles you apply for, prepare from your own experience, and keep moving at your pace.</p>
          <div className="auth-story-tools">
            <span><i>01</i> Applications and follow-ups</span>
            <span><i>02</i> Resume-based interview practice</span>
            <span><i>03</i> Your career profile</span>
          </div>
        </div>
        <div className="auth-story-footer">A practical workspace for the next step.</div>
      </aside>
      <main className="auth-panel">
        <div className="auth-card">
          <a className="auth-back-link" href="#home">‹ CareerOS home</a>
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(getRouteFromHash);
  const [token, setToken] = useState(() => getStoredValue("careeros.token"));
  const [account, setAccount] = useState(() => {
    try {
      return JSON.parse(getStoredValue("careeros.account") || "null");
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    let active = true;

    if (!token) {
      setProfile(null);
      setAuthReady(true);
      return () => {
        active = false;
      };
    }

    getProfile(token)
      .then((result) => {
        if (active) setProfile(result);
      })
      .catch((error) => {
        if (!active) return;
        window.localStorage.removeItem("careeros.token");
        window.localStorage.removeItem("careeros.account");
        window.sessionStorage.removeItem("careeros.token");
        window.sessionStorage.removeItem("careeros.account");
        setToken(null);
        setAccount(null);
        setProfile(null);
        setAuthNotice(`Unable to restore your session: ${error.message} Please sign in again.`);
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!authReady) return;
    const protectedRoutes = ["dashboard", "resume", "resume-analysis", "interview", "applications", "career-studio"];
    if (protectedRoutes.includes(route) && !token) {
      window.location.hash = "#login";
    }
  }, [authReady, route, token]);

  const handleAuthentication = useCallback(async (credentials, isRegistration, rememberMe = true) => {
    const result = isRegistration ? await register(credentials) : await login(credentials);
    const loadedProfile = await getProfile(result.token);
    const accountDetails = {
      userId: result.userId,
      email: result.email,
      name: result.name
    };
    window.localStorage.removeItem("careeros.token");
    window.localStorage.removeItem("careeros.account");
    window.sessionStorage.removeItem("careeros.token");
    window.sessionStorage.removeItem("careeros.account");
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    storage.setItem("careeros.token", result.token);
    storage.setItem("careeros.account", JSON.stringify(accountDetails));
    setToken(result.token);
    setAccount(accountDetails);
    setProfile(loadedProfile);
    setAuthNotice("");
    window.location.hash = "#dashboard";
  }, []);

  const handleProfileSave = useCallback(async (nextProfile) => {
    const result = await updateProfile(token, nextProfile);
    setProfile(result);
  }, [token]);

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem("careeros.token");
    window.localStorage.removeItem("careeros.account");
    window.sessionStorage.removeItem("careeros.token");
    window.sessionStorage.removeItem("careeros.account");
    setToken(null);
    setAccount(null);
    setProfile(null);
    setAuthNotice("");
    setRoute("home");
    window.location.hash = "#home";
  }, []);

  if (!authReady) {
    return <div className="loading-page" role="status">Loading your CareerOS workspace…</div>;
  }

  if (route === "login") {
    return (
      <AuthLayout>
        <Login
          onSubmit={(credentials, rememberMe) => handleAuthentication(credentials, false, rememberMe)}
          notice={authNotice}
        />
      </AuthLayout>
    );
  }

  if (route === "signup") {
    return (
      <AuthLayout>
        <Signup
          onSubmit={(credentials) => handleAuthentication(credentials, true)}
        />
      </AuthLayout>
    );
  }

  if (route === "dashboard" && profile && account) {
    const user = {
      name: profile.fullName || account.name,
      email: account.email
    };
    return (
      <AppShell user={user} route={route} onLogout={handleLogout}>
        <Dashboard profile={profile} user={user} token={token} onSaveProfile={handleProfileSave} />
      </AppShell>
    );
  }

  if (route === "jobs" && profile && account) {
    return <AppShell user={account} route={route} onLogout={handleLogout}><Jobs profile={profile} /></AppShell>;
  }

  if (route === "jobs") {
    return (
      <div className="public-jobs-page">
        <header className="public-jobs-header">
          <a className="public-brand" href="#home" aria-label="CareerOS home">
            <span className="brand-mark">C</span>
            <span>career<span className="brand-accent">OS</span></span>
          </a>
          <div>
            <a className="ghost-button" href="#login">Sign in</a>
            <a className="primary-button" href="#signup">Create account</a>
          </div>
        </header>
        <main><Jobs profile={profile} /></main>
      </div>
    );
  }

  if (route === "applications" && profile && account) {
    return <AppShell user={account} route={route} onLogout={handleLogout}><Applications token={token} /></AppShell>;
  }

  if (route === "resume" && profile && account) {
    return <AppShell user={account} route={route} onLogout={handleLogout}><ResumeNotes /></AppShell>;
  }

  if (route === "resume-analysis" && profile && account) {
    return <AppShell user={account} route={route} onLogout={handleLogout}><ResumeNotes /></AppShell>;
  }

  if (route === "interview" && profile && account) {
    return <AppShell user={account} route={route} onLogout={handleLogout}><Interview profile={profile} /></AppShell>;
  }

  if (route === "career-studio" && profile && account) {
    return <AppShell user={account} route={route} onLogout={handleLogout}><CareerStudio profile={profile} /></AppShell>;
  }

  return <Home />;
}

export default App;
