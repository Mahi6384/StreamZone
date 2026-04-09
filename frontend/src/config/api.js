const DEFAULT_API_BASE = "http://localhost:5000";
const API_BASE = (process.env.REACT_APP_API_BASE || DEFAULT_API_BASE).replace(/\/$/, "");

export const EXPERIENCES_API = (
  process.env.REACT_APP_EXPERIENCES_API || `${API_BASE}/api/experiences`
).replace(/\/$/, "");

export const USERS_API = (process.env.REACT_APP_USERS_API || `${API_BASE}/api/users`).replace(
  /\/$/,
  ""
);
