import { useEffect, useState } from "react";

// Reveals text character-by-character, like a live-typing interviewer.
// Plays once on mount only (each message mounts once in the chat list).
const TypewriterText = ({ text, speed = 14, onDone }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span>{text.slice(0, visibleCount)}</span>;
};

export default TypewriterText;
