import { useState } from "react";
import { motion } from "framer-motion";
import ParticleField from "../components/ParticleField";

const statsContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 16 } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
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

const getWeakAreas = (candidate) => {
  const missions = candidate.missions ?? [];
  const scored = missions
    .map((m) => ({
      title: m.title,
      score: m.skipped ? 100 : !m.passed ? 90 : (m.attempts ?? 1) * 10,
    }))
    .sort((a, b) => b.score - a.score)
    .filter((m) => m.score > 10);
  return scored.slice(0, 2).map((m) => m.title);
};

const CandidateCard = ({ candidate, onSelect, index }) => {
  const { member, signals } = candidate;
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const weakAreas = getWeakAreas(candidate);

  return (
    <motion.button
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(candidate)}
      className="text-left relative overflow-hidden rounded-2xl group h-full"
      style={{
        background: "linear-gradient(150deg, rgba(22,31,48,0.92), rgba(17,24,38,0.85))",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(245,166,35,0.14)",
      }}
    >
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #f5a623, transparent 55%, #3b82f6)",
          filter: "blur(14px)",
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(150deg, rgba(17,24,38,0.4), rgba(10,14,20,0.25))",
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
            transition={{ delay: 0.6 + index * 0.07, type: "spring", stiffness: 220, damping: 14 }}
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

        {weakAreas.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {weakAreas.map((area, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-1 rounded-md leading-none"
                style={{
                  background: "rgba(245,166,35,0.08)",
                  color: "#f5a623",
                  border: "1px solid rgba(245,166,35,0.15)",
                }}
              >
                Focus: {area}
              </span>
            ))}
          </div>
        )}

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

const Landing = ({ candidates, onStart, loading, onBack }) => {
  const [search, setSearch] = useState("");
  const totalMissions = candidates.reduce((sum, c) => sum + (c.signals?.missionsCompleted ?? 0), 0);
  const avgMissions = candidates.length ? Math.round(totalMissions / candidates.length) : 0;
  const filteredCandidates = candidates.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.member.name.toLowerCase().includes(q) ||
      c.member.jobRole.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-16 relative">
      <ParticleField />

      <div className="w-full max-w-3xl mb-8 relative">
        <button
          onClick={onBack}
          className="text-muted hover:text-accent text-sm transition-colors flex items-center gap-1.5"
        >
          &larr; Back
        </button>
      </div>

      <div className="max-w-xl text-center mb-8 relative">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl md:text-3xl font-semibold mb-2"
        >
          Choose a candidate
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="text-muted text-sm"
        >
          Each interview adapts to this candidate's real cohort progress.
        </motion.p>

        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-4 mt-6"
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
        className="w-full max-w-3xl mt-4 relative"
      >
        {candidates.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 max-w-xs mx-auto"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or role..."
              className="w-full text-sm px-4 py-2 rounded-full outline-none placeholder:text-muted transition-colors"
              style={{
                background: "rgba(22,31,48,0.6)",
                border: "1px solid rgba(245,166,35,0.15)",
                backdropFilter: "blur(10px)",
              }}
            />
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-32 rounded-2xl"
                style={{ background: "rgba(22,31,48,0.4)", border: "1px solid rgba(245,166,35,0.06)" }}
              >
                <motion.div
                  className="w-full h-full rounded-2xl"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCandidates.map((c, i) => (
              <CandidateCard key={c.member.id} candidate={c} onSelect={onStart} index={i} />
            ))}
          </div>
        )}
        {!loading && candidates.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-sm text-center py-12"
          >
            No candidates available right now. Check back shortly.
          </motion.p>
        )}
        {candidates.length > 0 && filteredCandidates.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-sm text-center py-12"
          >
            No candidates match "{search}".
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Landing;
