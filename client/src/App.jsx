import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./screens/Hero";
import Landing from "./screens/Landing";
import Chat from "./screens/Chat";
import Feedback from "./screens/Feedback";
import RobotMascot from "./components/RobotMascot";
import IntroScreen from "./components/IntroScreen";
import SoundToggle from "./components/SoundToggle";
import { startInterview } from "./api/interviewApi";

const SCREEN = {
  INTRO: "intro",
  HERO: "hero",
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
  [SCREEN.HERO]: { mood: "idle", message: "" },
  [SCREEN.LANDING]: { mood: "idle", message: "Pick a candidate to begin" },
  [SCREEN.CHAT]: { mood: "thinking", message: "" },
  [SCREEN.FEEDBACK]: { mood: "happy", message: "Interview wrapped up!" },
};

function App() {
  const [screen, setScreen] = useState(SCREEN.INTRO);
  const [candidates, setCandidates] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [initialReply, setInitialReply] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);
  const [startSlow, setStartSlow] = useState(false);
  const [mascotArrived, setMascotArrived] = useState(false);
  const [candidatesLoading, setCandidatesLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    fetch("/candidates.json")
      .then((res) => res.json())
      .then((data) => setCandidates(data.candidates || []))
      .catch(() => setError("Could not load candidate data"))
      .finally(() => setCandidatesLoading(false));
  }, []);

  const handleIntroFinish = () => {
    setScreen(SCREEN.HERO);
    setTimeout(() => setMascotArrived(true), 350);
  };

  const handleStart = async (selected) => {
    setCandidate(selected);
    setStarting(true);
    setStartSlow(false);
    const newSessionId = `${selected.member.id}-${Date.now()}`;
    setSessionId(newSessionId);

    const slowTimer = setTimeout(() => setStartSlow(true), 4000);

    try {
      const data = await startInterview(newSessionId, selected);
      setInitialReply(data.reply);
      setScreen(SCREEN.CHAT);
    } catch (err) {
      setError("Could not start the interview. Is the backend running?");
    } finally {
      clearTimeout(slowTimer);
      setStarting(false);
      setStartSlow(false);
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

  if (screen === SCREEN.INTRO) {
    return <IntroScreen onFinish={handleIntroFinish} />;
  }

  const mascotConfig = MASCOT_CONFIG[screen] || MASCOT_CONFIG[SCREEN.HERO];

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === SCREEN.HERO && (
          <motion.div key="hero" {...screenTransition}>
            <Hero onContinue={() => setScreen(SCREEN.LANDING)} />
          </motion.div>
        )}

        {screen === SCREEN.LANDING && (
          <motion.div key="landing" {...screenTransition}>
            <Landing
              candidates={candidates}
              onStart={handleStart}
              starting={starting}
              loading={candidatesLoading}
              onBack={() => setScreen(SCREEN.HERO)}
            />
          </motion.div>
        )}

        {screen === SCREEN.CHAT && (
          <motion.div key="chat" {...screenTransition}>
            <Chat
              sessionId={sessionId}
              candidate={candidate}
              initialReply={initialReply}
              onComplete={handleComplete}
              onExit={handleRestart}
            />
          </motion.div>
        )}

        {screen === SCREEN.FEEDBACK && (
          <motion.div key="feedback" {...screenTransition}>
            <Feedback candidate={candidate} feedback={feedback} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {starting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
            style={{ background: "rgba(10,14,20,0.85)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-muted text-sm">
              {startSlow ? "Waking up the server — this can take up to 50s..." : "Starting your interview..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {mascotArrived && (
        <RobotMascot mood={mascotConfig.mood} message={mascotConfig.message} />
      )}
      <SoundToggle />
    </>
  );
}

export default App;
