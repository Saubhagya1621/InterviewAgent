import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 35000,
});

const startInterview = async (sessionId, candidate) => {
  const { data } = await client.post("/interview", { sessionId, candidate });
  return data;
};

const sendMessage = async (sessionId, message) => {
  const { data } = await client.post("/interview", { sessionId, message });
  return data;
};

// Pings the backend health endpoint. Used to detect and wait out
// Render free-tier cold starts, which can take 30-50s.
const checkHealth = async () => {
  try {
    await axios.get(`${API_BASE}/health`, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};

export { startInterview, sendMessage, checkHealth };