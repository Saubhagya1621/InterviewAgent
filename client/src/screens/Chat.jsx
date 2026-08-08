import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessage } from "../api/interviewApi";
import ParticleField from "../components/ParticleField";

const bubbleVariants = {
  initial: (isUser) => ({ opacity: 0, y: 20, x: isUser ? 20 : -20, scale: 0.9 }),
  animate: { opacity: 1, y: 0, x: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const Bubble = ({ role, content, isError, onRetry }) => {
  const isUser = role === "user";
  return (
    <motion.div
      custom={isUser}
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        whileHover={{ scale: 1.015 }}
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isError
            ? "bg-red-500/10 border border-red-500/30 text-red-300"
            : isUser
            ? "bg-accent text-bg font-medium shadow-lg shadow-accent/20"
            : "bg-surface border border-border text-text"
        }`}
      >
        {content}
        {isError && (
          <button
            onClick={onRetry}
            className="block mt-2 text-xs font-medium text-red-300 underline underline-offset-2 hover:text-red-200"
          >
            Retry
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex justify-start"
  >
    <div className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center gap-2">
      <span className="text-muted text-xs mr-1">thinking</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-accent"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </motion.div>
);

const ProgressBar = ({ questionCount, min }) => {
  const pct = Math.min((questionCount / min) * 100, 100);
  return (
    <div className="w-28 h-1.5 bg-border rounded-full overflow-hidden relative">
      <motion.div
        className="h-full bg-gradient-to-r from-accent to-amber-300 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
};

const Chat = ({ sessionId, candidate, initialReply, onComplete }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: initialReply },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [currentFocus, setCurrentFocus] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const handleSend = async (overrideMessage) => {
    const messageText = overrideMessage ?? input.trim();
    if (!messageText || loading) return;

    const userMessage = { role: "user", content: messageText };
    if (!overrideMessage) {
      setMessages((prev) => [...prev, userMessage]);
    }
    setInput("");
    setLastFailedMessage(null);
    setLoading(true);

    try {
      const data = await sendMessage(sessionId, userMessage.content);

      if (data.done) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        setTimeout(() => onComplete(data.feedback), 700);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        setQuestionCount((c) => c + 1);
        if (data.currentFocus) setCurrentFocus(data.currentFocus);
      }
    } catch (err) {
      setLastFailedMessage(userMessage.content);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Couldn't reach the interviewer. Check your connection and retry.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (!lastFailedMessage) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    handleSend(lastFailedMessage);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-8 relative"
    >
      <ParticleField />
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 pb-4 px-5 py-4 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(22,31,48,0.7), rgba(17,24,38,0.5))",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(245,166,35,0.12)",
        }}
      >
        <div>
          <p className="font-display font-semibold text-lg">
            {candidate.member?.name}
          </p>
          <p className="text-muted text-xs">{candidate.member?.jobRole}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1.5">
          <div className="flex items-baseline gap-1.5">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={questionCount}
                initial={{ scale: 1.6, y: -10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="font-display font-semibold text-accent"
              >
                Q{questionCount}
              </motion.p>
            </AnimatePresence>
            <p className="text-muted text-xs uppercase tracking-wide">min. 8</p>
          </div>
          <ProgressBar questionCount={questionCount} min={8} />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {currentFocus && (
          <motion.div
            key={currentFocus.day}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mb-4 -mt-2 inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs"
            style={{
              background: "rgba(245,166,35,0.08)",
              border: "1px solid rgba(245,166,35,0.2)",
              color: "#f5a623",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Day {currentFocus.day} &middot; {currentFocus.title}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Bubble
              key={i}
              role={m.role}
              content={m.content}
              isError={m.isError}
              onRetry={handleRetry}
            />
          ))}
          {loading && <TypingIndicator key="typing" />}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 flex gap-2 rounded-2xl p-2 focus-within:border-accent/60 transition-colors"
        style={{
          background: "linear-gradient(135deg, rgba(22,31,48,0.7), rgba(17,24,38,0.5))",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(245,166,35,0.12)",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm px-2 py-2 placeholder:text-muted"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-accent text-bg font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-40"
        >
          Send
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Chat;
