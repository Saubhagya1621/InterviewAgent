import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

const startInterview = async (sessionId, candidate) => {
  const { data } = await client.post("/interview", { sessionId, candidate });
  return data;
};

const sendMessage = async (sessionId, message) => {
  const { data } = await client.post("/interview", { sessionId, message });
  return data;
};

export { startInterview, sendMessage };
