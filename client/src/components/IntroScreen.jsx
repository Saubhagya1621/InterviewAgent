import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RevealText from "./RevealText";
import ParticleField from "./ParticleField";

const BigRobot = () => (
  <motion.svg
    width="140"
    height="140"
    viewBox="0 0 72 72"
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.1 }}
  >
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
    <rect x="10" y="10" width="52" height="42" rx="16" fill="#161f30" stroke="#f5a62355" strokeWidth="1.5" />
    <rect x="16" y="18" width="40" height="24" rx="10" fill="#0a0e14" />
    <motion.circle
      cx="27"
      cy="30"
      r="4"
      fill="#f5a623"
      animate={{ scaleY: [1, 1, 0.1, 1, 1, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.6, 0.65, 0.7, 0.85, 1] }}
      style={{ originY: "30px" }}
    />
    <motion.circle
      cx="45"
      cy="30"
      r="4"
      fill="#f5a623"
      animate={{ scaleY: [1, 1, 0.1, 1, 1, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.6, 0.65, 0.7, 0.85, 1] }}
      style={{ originY: "30px" }}
    />
    <rect x="18" y="52" width="36" height="16" rx="8" fill="#161f30" stroke="#f5a62355" strokeWidth="1.5" />
    <circle cx="36" cy="60" r="3" fill="#f5a623" opacity="0.7" />
  </motion.svg>
);

const IntroScreen = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const dismissTimer = setTimeout(() => setExiting(true), 2600);
    return () => clearTimeout(dismissTimer);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const finishTimer = setTimeout(onFinish, 500);
    return () => clearTimeout(finishTimer);
  }, [exiting, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      style={{ background: "#0a0e14" }}
      onClick={() => setExiting(true)}
    >
      <ParticleField />

      <motion.div
        animate={{ y: exiting ? -30 : [0, -10, 0] }}
        transition={
          exiting
            ? { duration: 0.4 }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <BigRobot />
      </motion.div>

      <div className="mt-8 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          <RevealText text="AI Interview Agent" delay={500} />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="text-muted text-sm mt-3 tracking-wide"
        >
          Powered by your real progress through the AI Cohort
        </motion.p>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 0.6 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-10 text-muted text-xs tracking-widest uppercase"
      >
        Click anywhere to continue
      </motion.p>
    </motion.div>
  );
};

export default IntroScreen;
