import { useState } from "react";
import { motion } from "framer-motion";
import { setSoundEnabled, isSoundEnabled } from "../utils/sound";

const SoundToggle = () => {
  const [on, setOn] = useState(isSoundEnabled());

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="fixed top-5 right-5 z-40 w-9 h-9 rounded-full flex items-center justify-center text-sm"
      style={{
        background: "rgba(22,31,48,0.6)",
        border: "1px solid rgba(245,166,35,0.15)",
        backdropFilter: "blur(10px)",
        color: on ? "#f5a623" : "#8a96a8",
      }}
      title={on ? "Mute sound" : "Enable sound"}
    >
      {on ? "🔊" : "🔇"}
    </motion.button>
  );
};

export default SoundToggle;
