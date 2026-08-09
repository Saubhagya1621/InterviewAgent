import { motion } from "framer-motion";
import ParticleField from "../components/ParticleField";
import RevealText from "../components/RevealText";

const steps = [
  {
    step: "01",
    title: "Reads real progress",
    desc: "Pulls each candidate's actual mission history — skipped topics, retries, first-try passes — from their 31-day cohort data.",
  },
  {
    step: "02",
    title: "Adapts the interview",
    desc: "Picks the curriculum days most worth probing, then asks follow-ups based on how each answer actually goes.",
  },
  {
    step: "03",
    title: "Grounded feedback",
    desc: "Ends with strengths, gaps, and next steps tied to specific curriculum days — not generic advice.",
  },
];

// A small animated mock "conversation" visual for the hero — built with
// CSS/SVG, not a video file, so it stays lightweight and on-brand.
const HeroVisual = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="w-full max-w-md mx-auto rounded-2xl p-5 relative overflow-hidden"
    style={{
      background: "linear-gradient(150deg, rgba(22,31,48,0.8), rgba(17,24,38,0.6))",
      border: "1px solid rgba(245,166,35,0.15)",
      backdropFilter: "blur(16px)",
    }}
  >
    <div className="flex items-center gap-2 mb-4">
      <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-300/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
      <span className="ml-auto text-[10px] text-muted uppercase tracking-widest">Live interview</span>
    </div>

    {[
      { role: "ai", text: "Day 12 — can you explain few-shot prompting?", delay: 0.9 },
      { role: "user", text: "Sure, you give the model a few examples...", delay: 1.6 },
      { role: "ai", text: "Good. Now, how would that scale with 100 intents?", delay: 2.3 },
    ].map((m, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: m.delay, duration: 0.4 }}
        className={`flex mb-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
            m.role === "user" ? "bg-accent text-bg font-medium" : "bg-surface border border-border text-text"
          }`}
        >
          {m.text}
        </div>
      </motion.div>
    ))}

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ delay: 3, duration: 1.4, repeat: Infinity, repeatDelay: 0.6 }}
      className="flex gap-1 pl-1 mt-1"
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted" />
      ))}
    </motion.div>
  </motion.div>
);

const Hero = ({ onContinue }) => {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-16 relative">
      <ParticleField />

      <div className="max-w-2xl text-center mb-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <motion.p
            className="text-accent font-display uppercase tracking-[0.25em] text-[11px] px-4 py-1.5 rounded-full"
            style={{
              border: "1px solid rgba(245,166,35,0.35)",
              background: "rgba(245,166,35,0.06)",
            }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(245,166,35,0)",
                "0 0 20px rgba(245,166,35,0.35)",
                "0 0 0px rgba(245,166,35,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            SignalProbe &middot; AI Cohort Interview
          </motion.p>
        </motion.div>

        <h1 className="font-display text-[2.75rem] md:text-6xl font-bold leading-[1.05] mb-6 tracking-tight">
          <RevealText text="Your interviewer" className="block" />
          <motion.span
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block bg-gradient-to-r from-accent via-amber-200 to-accent bg-[length:200%_auto] bg-clip-text text-transparent"
            style={{ animation: "shimmer 3s linear infinite" }}
          >
            already knows
          </motion.span>
          <RevealText text="where you struggled." delay={1100} className="block" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="text-muted text-base leading-relaxed max-w-lg mx-auto mb-9"
        >
          Not a generic quiz. Every question is pulled from your real progress
          through the 31-day cohort — what you skipped, retried, or barely passed.
        </motion.p>
      </div>

      <HeroVisual />

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.4, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="mt-10 px-7 py-3 rounded-full font-display font-semibold text-sm relative overflow-hidden"
        style={{
          background: "#f5a623",
          color: "#0a0e14",
          boxShadow: "0 8px 30px rgba(245,166,35,0.3)",
        }}
      >
        Choose a candidate &rarr;
      </motion.button>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.7, duration: 0.5 }}
        className="w-full max-w-3xl mt-20 relative"
      >
        <p className="font-display font-semibold text-lg text-center mb-8">How it works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.8 + i * 0.1, duration: 0.4 }}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(22,31,48,0.5)",
                border: "1px solid rgba(245,166,35,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p className="text-accent font-display font-bold text-2xl mb-2 opacity-60">{s.step}</p>
              <p className="font-display font-semibold text-sm mb-2">{s.title}</p>
              <p className="text-muted text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.2, duration: 0.5 }}
        className="w-full max-w-3xl mt-14 pt-8 pb-4 text-center relative"
        style={{ borderTop: "1px solid rgba(245,166,35,0.08)" }}
      >
        <p className="text-muted text-xs leading-relaxed">
          Built by <span className="text-accent font-medium">Saubhagya Srivastava</span> for ViCodathon
          (ABTalks Vibe Code Hackathon) — solo, 48 hours.
        </p>
        <p className="text-muted text-[11px] mt-2 opacity-60">
          Node.js · Express · React · Groq (Llama 3.1) · Framer Motion
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a
            href="https://github.com/Saubhagya1621"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-xs hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <span className="text-muted opacity-30">&middot;</span>
          <a
            href="https://linkedin.com/in/saubhagyasri"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-xs hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default Hero;
