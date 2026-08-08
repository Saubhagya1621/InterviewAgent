const Section = ({ title, items, accentClass }) => (
  <div className="bg-surface border border-border rounded-xl p-5">
    <p className={`font-display font-semibold text-sm uppercase tracking-wide mb-3 ${accentClass}`}>
      {title}
    </p>
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-text leading-relaxed flex gap-2">
          <span className="text-muted">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Feedback = ({ candidate, feedback, onRestart }) => {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-16">
      <p className="text-accent font-display uppercase tracking-[0.2em] text-xs mb-3">
        Interview complete
      </p>
      <h1 className="font-display text-3xl font-semibold mb-2">
        {candidate.member?.name}
      </h1>
      <p className="text-muted text-sm mb-8 leading-relaxed">{feedback.summary}</p>

      <div className="flex flex-col gap-4">
        <Section title="Strengths" items={feedback.strengths} accentClass="text-emerald-400" />
        <Section title="Gaps" items={feedback.gaps} accentClass="text-accent" />
        <Section title="Next steps" items={feedback.next} accentClass="text-sky-400" />
      </div>

      <button
        onClick={onRestart}
        className="mt-8 text-sm text-muted hover:text-text underline underline-offset-4"
      >
        Start another interview
      </button>
    </div>
  );
};

export default Feedback;
