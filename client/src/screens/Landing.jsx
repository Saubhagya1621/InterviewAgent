const CandidateCard = ({ candidate, onSelect }) => {
  const { member, signals } = candidate;
  return (
    <button
      onClick={() => onSelect(candidate)}
      className="w-full text-left bg-surface border border-border rounded-xl p-5 hover:border-accent/60 hover:bg-surfaceAlt transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-lg">{member.name}</p>
          <p className="text-muted text-sm">{member.jobRole} &middot; {member.yearsExperience} yrs exp</p>
        </div>
        <div className="text-right">
          <p className="text-accent font-display font-semibold text-xl">
            {signals?.missionsCompleted ?? 0}
          </p>
          <p className="text-muted text-xs uppercase tracking-wide">missions done</p>
        </div>
      </div>
    </button>
  );
};

const Landing = ({ candidates, onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="max-w-xl text-center mb-12">
        <p className="text-accent font-display uppercase tracking-[0.2em] text-xs mb-4">
          AI Cohort &middot; Interview Agent
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
          Your interviewer already knows where you struggled.
        </h1>
        <p className="text-muted text-base leading-relaxed">
          This isn&apos;t a generic quiz. Every question is chosen from your actual
          progress through the 31-day cohort — the topics you skipped, retried,
          or barely passed.
        </p>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-3">
        <p className="text-muted text-sm mb-1">Select a candidate to begin</p>
        {candidates.map((c) => (
          <CandidateCard key={c.member.id} candidate={c} onSelect={onStart} />
        ))}
      </div>
    </div>
  );
};

export default Landing;
