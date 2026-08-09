import { motion, AnimatePresence } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";
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

const computeReadiness = (candidate, day) => {
  const mission = (candidate.missions ?? []).find((m) => m.day === day.day);
  if (!mission) return 65;
  if (mission.skipped) return 20;
  if (!mission.passed) return 40;
  const attempts = mission.attempts ?? 1;
  if (attempts > 2) return 60;
  return 90;
};

const CurriculumRadar = ({ candidate, topics }) => {
  if (!topics || topics.length < 3) return null;

  const data = topics.map((t) => ({
    subject: `Day ${t.day}`,
    fullTitle: t.title,
    readiness: computeReadiness(candidate, t),
  }));

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl p-5 mb-6"
      style={{
        background: "linear-gradient(135deg, rgba(22,31,48,0.7), rgba(17,24,38,0.5))",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(245,166,35,0.12)",
      }}
    >
      <p className="font-display font-semibold text-sm uppercase tracking-wide mb-1 text-center text-muted">
        Pre-interview readiness by topic
      </p>
      <p className="text-[11px] text-muted text-center mb-2 opacity-70">
        Based on your original cohort progress data
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#232d3f" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#8a96a8", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="readiness"
            stroke="#f5a623"
            fill="#f5a623"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

const TopicsCovered = ({ topics }) => {
  if (!topics || topics.length === 0) return null;
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center mb-8">
      {topics.map((t, i) => (
        <motion.span
          key={t.day}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + i * 0.08, type: "spring", stiffness: 200 }}
          className="text-[11px] px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(59,130,246,0.08)",
            color: "#7dabf8",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          Day {t.day} &middot; {t.title}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Feedback = ({ candidate, feedback, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.3 },
        colors: ["#f5a623", "#fcd34d", "#3b82f6"],
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const addWrapped = (text, size, gap, color = "#111") => {
      doc.setFontSize(size);
      doc.setTextColor(color);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (y > 780) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += size * 1.35;
      });
      y += gap;
    };

    doc.setFont("helvetica", "bold");
    addWrapped("SignalProbe — Interview Feedback Report", 18, 10, "#f5a623");
    doc.setFont("helvetica", "normal");
    addWrapped(`Candidate: ${candidate.member?.name} (${candidate.member?.jobRole})`, 11, 16, "#555");

    doc.setFont("helvetica", "bold");
    addWrapped("Summary", 13, 4);
    doc.setFont("helvetica", "normal");
    addWrapped(feedback.summary, 10.5, 16);

    const addList = (title, items) => {
      doc.setFont("helvetica", "bold");
      addWrapped(title, 13, 4);
      doc.setFont("helvetica", "normal");
      if (items.length === 0) {
        addWrapped("None noted for this interview.", 10.5, 12, "#888");
      } else {
        items.forEach((item) => addWrapped(`•  ${item}`, 10.5, 6));
        y += 10;
      }
    };

    addList("Strengths", feedback.strengths);
    addList("Gaps", feedback.gaps);
    addList("Next Steps", feedback.next);

    if (feedback.topicsCovered?.length) {
      doc.setFont("helvetica", "bold");
      addWrapped("Curriculum Days Covered", 13, 4);
      doc.setFont("helvetica", "normal");
      feedback.topicsCovered.forEach((t) =>
        addWrapped(`Day ${t.day} — ${t.title}`, 10.5, 4, "#3b82f6")
      );
    }

    doc.save(`interview-feedback-${candidate.member?.name?.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const handleCopy = async () => {
    const lines = [
      `Interview Feedback — ${candidate.member?.name}`,
      "",
      `Summary: ${feedback.summary}`,
      "",
      "Strengths:",
      ...feedback.strengths.map((s) => `- ${s}`),
      "",
      "Gaps:",
      ...feedback.gaps.map((g) => `- ${g}`),
      "",
      "Next steps:",
      ...feedback.next.map((n) => `- ${n}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; silently ignore.
    }
  };

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
        className="text-muted text-sm mb-6 leading-relaxed text-center max-w-lg mx-auto"
      >
        {feedback.summary}
      </motion.p>

      <CurriculumRadar candidate={candidate} topics={feedback.topicsCovered} />
      <TopicsCovered topics={feedback.topicsCovered} />

      <div className="flex flex-col gap-4">
        <Section title="Strengths" items={feedback.strengths} accentClass="text-emerald-400" delay={0.5} />
        <Section title="Gaps" items={feedback.gaps} accentClass="text-accent" delay={0.65} />
        <Section title="Next steps" items={feedback.next} accentClass="text-sky-400" delay={0.8} />
      </div>

      <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handleCopy}
          className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            background: copied ? "rgba(52,211,153,0.12)" : "rgba(245,166,35,0.1)",
            color: copied ? "#34d399" : "#f5a623",
            border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(245,166,35,0.25)"}`,
          }}
        >
          {copied ? "Copied ✓" : "Copy summary"}
        </button>
        <button
          onClick={handleDownloadPdf}
          className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            background: "rgba(59,130,246,0.1)",
            color: "#7dabf8",
            border: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          Download PDF
        </button>
        <button
          onClick={onRestart}
          className="text-sm text-muted hover:text-text underline underline-offset-4"
        >
          Start another interview
        </button>
      </motion.div>

      {feedback.transcript?.length > 0 && (
        <motion.div variants={itemVariants} className="mt-6">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="text-xs text-muted hover:text-text mx-auto block items-center gap-1.5"
          >
            {showTranscript ? "Hide" : "View"} full transcript
            <motion.span animate={{ rotate: showTranscript ? 180 : 0 }} transition={{ duration: 0.2 }}>
              ▾
            </motion.span>
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 rounded-2xl p-5 flex flex-col gap-3 max-h-96 overflow-y-auto"
                  style={{
                    background: "rgba(17,24,38,0.5)",
                    border: "1px solid rgba(245,166,35,0.1)",
                  }}
                >
                  {feedback.transcript.map((m, i) => (
                    <div
                      key={i}
                      className={`text-xs leading-relaxed ${
                        m.role === "user" ? "text-accent" : "text-muted"
                      }`}
                    >
                      <span className="font-semibold uppercase tracking-wide mr-2 opacity-70">
                        {m.role === "user" ? "Candidate" : "Interviewer"}
                      </span>
                      {m.content}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Feedback;
