const DEFAULT_EXPERIENCES_API = "http://localhost:5000/api/experiences";

export const EXPERIENCES_API = (
  process.env.REACT_APP_EXPERIENCES_API || DEFAULT_EXPERIENCES_API
).replace(/\/$/, "");
