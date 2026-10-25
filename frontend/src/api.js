const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const AUTH_TOKEN_KEY = "cv-insights-token";

export function saveAuthToken(token, rememberMe = false) {
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;
  storage.setItem(AUTH_TOKEN_KEY, token);
  otherStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
    || window.sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || `Request failed (${response.status}).`);
  }

  return result;
}

export async function apiDownload(path, filename) {
  const headers = new Headers();
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }

  const response = await fetch(`${API_BASE}${path}`, { headers });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Download failed (${response.status}).`);
  }

  const objectUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
