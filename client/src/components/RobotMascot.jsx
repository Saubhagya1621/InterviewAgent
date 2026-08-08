import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// A small floating robot mascot, present across every screen.
// - Eyes track the cursor
// - Idle bob + occasional blink
// - Reacts (bounce) when `mood` changes: "idle" | "thinking" | "happy"
const RobotMascot = ({ mood = "idle", message = "" }) => {
  const [blink, setBlink] = useState(false);
  const containerRef = useRef(null);

  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const smoothEyeX = useSpring(eyeX, { stiffness: 120, damping: 14 });
  const smoothEyeY = useSpring(eyeY, { stiffness: 120, damping: 14 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const clampedDist = Math.min(dist, 400);
      eyeX.set((dx / dist) * (clampedDist / 400) * 4);
      eyeY.set((dy / dist) * (clampedDist / 400) * 3);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [eyeX, eyeY]);

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2200 + Math.random() * 2600;
      return setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        timer = scheduleBlink();
      }, delay);
    };
    let timer = scheduleBlink();
    return () => clearTimeout(timer);
  }, []);

  const bodyBob =
    mood === "thinking"
      ? { y: [0, -3, 0, -3, 0], rotate: [-2, 2, -2, 2, 0] }
      : { y: [0, -8, 0] };

  const bodyTransition =
    mood === "thinking"
      ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      : { duration: 3.2, repeat: Infinity, ease: "easeInOut" };

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-40 select-none pointer-events-none"
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 160, damping: 14 }}
    >
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -top-11 right-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-medium"
          style={{
            background: "rgba(22,31,48,0.9)",
            border: "1px solid rgba(245,166,35,0.25)",
            color: "#f5a623",
            backdropFilter: "blur(8px)",
          }}
        >
          {message}
        </motion.div>
      )}

      <motion.div animate={bodyBob} transition={bodyTransition}>
        <motion.svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          animate={mood === "happy" ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* antenna */}
          <motion.line
            x1="36"
            y1="10"
            x2="36"
            y2="2"
            stroke="#f5a623"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <motion.circle
            cx="36"
            cy="2"
            r="2.5"
            fill="#f5a623"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* head */}
          <rect
            x="10"
            y="10"
            width="52"
            height="42"
            rx="16"
            fill="#161f30"
            stroke="#f5a62355"
            strokeWidth="1.5"
          />

          {/* visor */}
          <rect x="16" y="18" width="40" height="24" rx="10" fill="#0a0e14" />

          {/* eyes */}
          <motion.g style={{ x: smoothEyeX, y: smoothEyeY }}>
            <motion.circle
              cx="27"
              cy="30"
              r="4"
              fill="#f5a623"
              animate={{ scaleY: blink ? 0.1 : 1 }}
              transition={{ duration: 0.1 }}
              style={{ originY: "30px" }}
            />
            <motion.circle
              cx="45"
              cy="30"
              r="4"
              fill="#f5a623"
              animate={{ scaleY: blink ? 0.1 : 1 }}
              transition={{ duration: 0.1 }}
              style={{ originY: "30px" }}
            />
          </motion.g>

          {/* body */}
          <rect
            x="18"
            y="52"
            width="36"
            height="16"
            rx="8"
            fill="#161f30"
            stroke="#f5a62355"
            strokeWidth="1.5"
          />
          <circle cx="36" cy="60" r="3" fill="#f5a623" opacity="0.7" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

export default RobotMascot;
