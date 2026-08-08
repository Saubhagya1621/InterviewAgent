import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../api/interviewApi";

const Bubble = ({ role, content }) => {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-accent text-bg font-medium"
            : "bg-surface border border-border text-text"
        }`}
      >
        {content}
      </div>
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
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(sessionId, userMessage.content);

      if (data.done) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        onComplete(data.feedback);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        setQuestionCount((c) => c + 1);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching the interviewer. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div>
          <p className="font-display font-semibold text-lg">
            {candidate.member?.name}
          </p>
          <p className="text-muted text-xs">{candidate.member?.jobRole}</p>
        </div>
        <div className="text-right">
          <p className="text-accent font-display font-semibold">Q{questionCount}</p>
          <p className="text-muted text-xs uppercase tracking-wide">min. 8</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-xl px-4 py-3 text-muted text-sm">
              Interviewer is typing...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-4 flex gap-2 border border-border rounded-xl bg-surface p-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm px-2 py-2 placeholder:text-muted"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-accent text-bg font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
