// Picks which curriculum days to probe for a given candidate,
// weighted toward weak signals: skipped days, high attempt counts,
// and low first-try success rate.

const MIN_TARGET_DAYS = 5;

const scoreMission = (mission) => {
  // Higher score = more worth probing in the interview.
  if (mission.skipped) return 100;
  if (!mission.passed) return 90;
  const attempts = mission.attempts ?? 1;
  // More attempts to pass = weaker signal = higher probe priority.
  return attempts * 10;
};

const selectTargetDays = (candidate, curriculumDays) => {
  const missions = candidate.missions ?? [];

  const scored = missions
    .map((m) => ({ day: m.day, title: m.title, score: scoreMission(m) }))
    .sort((a, b) => b.score - a.score);

  let targetDays = scored.slice(0, MIN_TARGET_DAYS).map((m) => m.day);

  // Fallback: if candidate has fewer than MIN_TARGET_DAYS missions logged,
  // fill remaining slots with early curriculum days not already included.
  if (targetDays.length < MIN_TARGET_DAYS && Array.isArray(curriculumDays)) {
    for (const d of curriculumDays) {
      if (targetDays.length >= MIN_TARGET_DAYS) break;
      if (!targetDays.includes(d.day)) targetDays.push(d.day);
    }
  }

  return targetDays;
};

export { selectTargetDays };
