import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./screens/Landing";
import Chat from "./screens/Chat";
import Feedback from "./screens/Feedback";
import RobotMascot from "./components/RobotMascot";
import { startInterview } from "./api/interviewApi";

const SCREEN = {
  LANDING: "landing",
  CHAT: "chat",
  FEEDBACK: "feedback",
};

const screenTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

const MASCOT_CONFIG = {
  [SCREEN.LANDING]: { mood: "idle", message: "Pick a candidate to begin" },
  [SCREEN.CHAT]: { mood: "thinking", message: "" },
  [SCREEN.FEEDBACK]: { mood: "happy", message: "Interview wrapped up!" },
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

  const mascotConfig = MASCOT_CONFIG[screen] || MASCOT_CONFIG[SCREEN.LANDING];

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === SCREEN.LANDING && (
          <motion.div key="landing" {...screenTransition}>
            <Landing candidates={candidates} onStart={handleStart} />
          </motion.div>
        )}

        {screen === SCREEN.CHAT && (
          <motion.div key="chat" {...screenTransition}>
            <Chat
              sessionId={sessionId}
              candidate={candidate}
              initialReply={initialReply}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {screen === SCREEN.FEEDBACK && (
          <motion.div key="feedback" {...screenTransition}>
            <Feedback candidate={candidate} feedback={feedback} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>

      <RobotMascot mood={mascotConfig.mood} message={mascotConfig.message} />
    </>
  );
}

export default App;
