import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

// Splits text into spans and reveals them with a staggered blur+rise
// animation via anime.js. Use for hero headlines.
const RevealText = ({ text, className = "", delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll(".reveal-char");

    animate(chars, {
      opacity: [0, 1],
      translateY: [24, 0],
      filter: ["blur(6px)", "blur(0px)"],
      duration: 700,
      delay: stagger(18, { start: delay }),
      easing: "easeOutExpo",
    });
  }, [text, delay]);

  const words = text.split(" ");

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="reveal-char inline-block"
              style={{ opacity: 0 }}
            >
              {char}
            </span>
          ))}
          {wi < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
};

export default RevealText;
