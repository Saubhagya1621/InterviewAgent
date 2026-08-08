import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useEffect, useState } from "react";
import ParticleField from "../components/ParticleField";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 14 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 18 } },
};

const useCountUp = (target, duration = 1000, delay = 400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now() + delay;

    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);

  return value;
};

const Section = ({ title, items, accentClass, delay }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -3 }}
    className="rounded-2xl p-5 transition-colors"
    style={{
      background: "linear-gradient(135deg, rgba(22,31,48,0.7), rgba(17,24,38,0.5))",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(245,166,35,0.12)",
    }}
  >
    <p className={`font-display font-semibold text-sm uppercase tracking-wide mb-3 ${accentClass}`}>
      {title}
    </p>
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="show"
      transition={{ delayChildren: delay }}
      className="flex flex-col gap-2"
    >
      {items.length === 0 && (
        <li className="text-sm text-muted italic">None noted for this interview.</li>
      )}
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={listItemVariants}
          className="text-sm text-text leading-relaxed flex gap-2"
        >
          <span className="text-muted">-</span>
          <span>{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
);

const ScoreRing = ({ strengths, gaps }) => {
  const total = strengths + gaps;
  const pct = total > 0 ? Math.round((strengths / total) * 100) : 0;
  const animatedPct = useCountUp(pct, 1200, 500);
  const data = [{ name: "score", value: animatedPct, fill: "#f5a623" }];

  return (
    <motion.div
      variants={itemVariants}
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.2 }}
      className="relative w-32 h-32 mx-auto mb-2"
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, #f5a62333 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <RadialBarChart
        width={128}
        height={128}
        cx={64}
        cy={64}
        innerRadius={44}
        outerRadius={58}
        barSize={9}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background={{ fill: "#232d3f" }} dataKey="value" cornerRadius={9} />
      </RadialBarChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-semibold text-2xl text-accent">{animatedPct}%</span>
      </div>
    </motion.div>
  );
};

const Feedback = ({ candidate, feedback, onRestart }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen max-w-2xl mx-auto px-4 py-16 relative"
    >
      <ParticleField />
      <motion.p
        variants={itemVariants}
        className="text-accent font-display uppercase tracking-[0.2em] text-xs mb-3 text-center"
      >
        Interview complete
      </motion.p>

      <ScoreRing strengths={feedback.strengths.length} gaps={feedback.gaps.length} />

      <motion.h1
        variants={itemVariants}
        className="font-display text-3xl font-semibold mb-2 text-center"
      >
        {candidate.member?.name}
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-muted text-sm mb-8 leading-relaxed text-center max-w-lg mx-auto"
      >
        {feedback.summary}
      </motion.p>

      <div className="flex flex-col gap-4">
        <Section title="Strengths" items={feedback.strengths} accentClass="text-emerald-400" delay={0.5} />
        <Section title="Gaps" items={feedback.gaps} accentClass="text-accent" delay={0.65} />
        <Section title="Next steps" items={feedback.next} accentClass="text-sky-400" delay={0.8} />
      </div>

      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onRestart}
        className="mt-8 text-sm text-muted hover:text-text underline underline-offset-4 block mx-auto"
      >
        Start another interview
      </motion.button>
    </motion.div>
  );
};

export default Feedback;
