// In-memory interview session store.
// sessionId -> InterviewState
const sessions = new Map();

/**
 * InterviewState shape:
 * {
 *   candidate: object,
 *   targetDays: number[],        // curriculum days chosen for this candidate
 *   askedDays: number[],         // days actually covered so far
 *   turnCount: number,           // number of assistant questions asked
 *   history: [{ role: "user"|"assistant", content: string }],
 *   done: boolean
 * }
 */

const createSession = (sessionId, state) => {
  sessions.set(sessionId, state);
  return state;
};

const getSession = (sessionId) => sessions.get(sessionId);

const updateSession = (sessionId, patch) => {
  const existing = sessions.get(sessionId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  sessions.set(sessionId, updated);
  return updated;
};

const hasSession = (sessionId) => sessions.has(sessionId);

export { createSession, getSession, updateSession, hasSession };
