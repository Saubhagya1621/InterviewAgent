import { useEffect, useState } from "react";
import Landing from "./screens/Landing";
import Chat from "./screens/Chat";
import Feedback from "./screens/Feedback";
import { startInterview } from "./api/interviewApi";

const SCREEN = {
  LANDING: "landing",
  CHAT: "chat",
  FEEDBACK: "feedback",
};

function App() {
  const [screen, setScreen] = useState(SCREEN.LANDING);
  const [candidates, setCandidates] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [initialReply, setInitialReply] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/candidates.json")
      .then((res) => res.json())
      .then((data) => setCandidates(data.candidates || []))
      .catch(() => setError("Could not load candidate data"));
  }, []);

  const handleStart = async (selected) => {
    setCandidate(selected);
    const newSessionId = `${selected.member.id}-${Date.now()}`;
    setSessionId(newSessionId);

    try {
      const data = await startInterview(newSessionId, selected);
      setInitialReply(data.reply);
      setScreen(SCREEN.CHAT);
    } catch (err) {
      setError("Could not start the interview. Is the backend running?");
    }
  };

  const handleComplete = (fb) => {
    setFeedback(fb);
    setScreen(SCREEN.FEEDBACK);
  };

  const handleRestart = () => {
    setScreen(SCREEN.LANDING);
    setCandidate(null);
    setSessionId(null);
    setFeedback(null);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-muted text-sm max-w-sm">{error}</p>
      </div>
    );
  }

  if (screen === SCREEN.LANDING) {
    return <Landing candidates={candidates} onStart={handleStart} />;
  }

  if (screen === SCREEN.CHAT) {
    return (
      <Chat
        sessionId={sessionId}
        candidate={candidate}
        initialReply={initialReply}
        onComplete={handleComplete}
      />
    );
  }

  if (screen === SCREEN.FEEDBACK) {
    return (
      <Feedback candidate={candidate} feedback={feedback} onRestart={handleRestart} />
    );
  }

  return null;
}

export default App;
