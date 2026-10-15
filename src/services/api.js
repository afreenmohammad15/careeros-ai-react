const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const responseText = await response.text();
  let body = null;
  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      body = responseText;
    }
  }

  if (!response.ok) {
    const message = body && typeof body === "object"
      ? Object.values(body).filter(Boolean).join(" ")
      : body;
    const error = new Error(message || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return body;
}

export function login(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function register(credentials) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function getProfile(token) {
  return request("/api/profile", { token });
}

export function updateProfile(token, profile) {
  return request("/api/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(profile)
  });
}

export function getJobs(token) {
  return request("/api/jobs", { token });
}

export function applyForJob(token, jobId) {
  return request(`/api/jobs/${jobId}/applications`, { method: "POST", token });
}

export function getMyApplications(token) {
  return request("/api/applications/me", { token });
}

export function addExternalApplication(token, application) {
  return request("/api/applications/me", {
    method: "POST",
    token,
    body: JSON.stringify(application)
  });
}

export function updateApplication(token, applicationId, application) {
  return request(`/api/applications/${applicationId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(application)
  });
}
