import { motion } from "framer-motion";
import ParticleField from "../components/ParticleField";
import RevealText from "../components/RevealText";

const statsContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 1.6 } },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 16 } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 1.9 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 130, damping: 16 },
  },
};

const StatChip = ({ label, value }) => (
  <motion.div
    variants={statItemVariants}
    className="flex flex-col items-center px-5 py-3 rounded-xl"
    style={{
      background: "rgba(22,31,48,0.5)",
      border: "1px solid rgba(245,166,35,0.1)",
      backdropFilter: "blur(10px)",
    }}
  >
    <span className="text-accent font-display font-bold text-xl">{value}</span>
    <span className="text-muted text-[10px] uppercase tracking-widest mt-0.5">{label}</span>
  </motion.div>
);

const CandidateCard = ({ candidate, onSelect, index }) => {
  const { member, signals } = candidate;
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.button
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(candidate)}
      className="text-left relative overflow-hidden rounded-2xl group h-full"
      style={{
        background: "linear-gradient(150deg, rgba(22,31,48,0.75), rgba(17,24,38,0.55))",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(245,166,35,0.12)",
      }}
    >
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: "linear-gradient(135deg, #f5a623, transparent 50%, #3b82f6)",
          filter: "blur(10px)",
        }}
      />

      <div className="relative px-5 py-5 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-display font-semibold text-sm"
            style={{
              background: "rgba(245,166,35,0.12)",
              color: "#f5a623",
              border: "1px solid rgba(245,166,35,0.25)",
            }}
          >
            {initials}
          </div>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.1 + index * 0.07, type: "spring", stiffness: 220, damping: 14 }}
            className="text-right"
          >
            <p className="text-accent font-display font-bold text-lg leading-none">
              {signals?.missionsCompleted ?? 0}
            </p>
            <p className="text-muted text-[9px] uppercase tracking-widest mt-0.5">missions</p>
          </motion.div>
        </div>

        <div>
          <p className="font-display font-semibold text-base tracking-tight">{member.name}</p>
          <p className="text-muted text-xs mt-0.5">{member.jobRole}</p>
          <p className="text-muted text-[11px] mt-0.5 opacity-70">{member.yearsExperience} yrs experience</p>
        </div>

        <div className="mt-auto pt-2 flex items-center gap-1.5 text-[11px] text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Start interview
          <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
            &rarr;
          </motion.span>
        </div>
      </div>
    </motion.button>
  );
};

const Landing = ({ candidates, onStart }) => {
  const totalMissions = candidates.reduce((sum, c) => sum + (c.signals?.missionsCompleted ?? 0), 0);
  const avgMissions = candidates.length ? Math.round(totalMissions / candidates.length) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-16 relative">
      <ParticleField />

      <div className="max-w-2xl text-center mb-8 relative">
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
            AI Cohort &middot; Interview Agent
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
          className="text-muted text-base leading-relaxed max-w-lg mx-auto mb-8"
        >
          Not a generic quiz. Every question is pulled from your real progress
          through the 31-day cohort — what you skipped, retried, or barely passed.
        </motion.p>

        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-4"
        >
          <StatChip label="candidates" value={candidates.length} />
          <StatChip label="avg. missions" value={avgMissions} />
          <StatChip label="curriculum days" value="31" />
        </motion.div>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-3xl mt-8 relative"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.85 }}
          className="text-muted text-sm mb-4 text-center tracking-wide"
        >
          Select a candidate to begin
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {candidates.map((c, i) => (
            <CandidateCard key={c.member.id} candidate={c} onSelect={onStart} index={i} />
          ))}
        </div>
        {candidates.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-sm text-center py-12"
          >
            No candidates available right now. Check back shortly.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Landing;
