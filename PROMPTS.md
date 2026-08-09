# AI Usage Log — SignalProbe

This log tracks how Claude was used across the build, phase by phase, matching the commit history in this repo. Every feature below was built iteratively and tested locally before being committed — nothing here was generated in one shot and dropped in.

---

## Phase 0 — Project scaffold & architecture

**Goal:** Set up a clean, extensible monorepo before writing any feature logic.

- Asked Claude to scaffold an Express backend in a "chai aur code" architectural style: `asyncHandler` wrapper, `ApiError`/`ApiResponse` classes, modular `controllers/`/`routes/`/`utils/` separation — a pattern I use across my other projects (QueueLess, AshVault) for consistency.
- Prompt: *"Build an Express backend for an AI interview agent matching this API contract [technical-spec.md], with adaptive question selection based on candidate weak signals from candidates.json, and structured feedback output validated against a zod schema."*
- Set up `/server` and `/client` as a single repo, `.env.example` for both, and an in-memory session store (`Map<sessionId, InterviewState>`) since the brief explicitly ruled out persistent storage.

---

## Phase 1 — Core interview logic (the actual engineering problem)

**Goal:** Make the interview genuinely adaptive, not a scripted question list.

- Designed `topicSelector.js` with Claude to score each candidate's curriculum missions by weakness signal (`skipped` > `!passed` > high `attempts`) and select the 4–5 curriculum days most worth probing — this is what makes the interview personalized to real progress data rather than generic.
- Iterated on the system prompt (`prompts.js`) multiple times to enforce: one question at a time, adaptive follow-ups based on answer quality, and a minimum coverage requirement (8 questions / 4 distinct days) before the interview can end.
- Added zod schema validation (`schemas.js`) on every LLM response (both the per-turn JSON and the final feedback JSON), with a single retry on malformed output before failing gracefully with an `ApiError`.

---

## Phase 2 — Frontend build

**Goal:** Landing → Chat → Feedback flow, wired to the real backend (no mocked UI).

- Built with React + Vite + Tailwind. Asked Claude to scaffold three screens matching the API contract exactly, then iterated screen-by-screen:
  - `Landing.jsx` — candidate selection
  - `Chat.jsx` — turn-based conversation UI
  - `Feedback.jsx` — structured results display
- Verified every screen against the live backend locally (`curl` + browser) before moving to polish — caught and fixed real bugs this way (see Phase 5).

---

## Phase 3 — Motion & visual design pass

**Goal:** High-motion, distinctive UI — explicitly requested as a judging differentiator.

- Iterated through several rounds with Claude on the visual direction: initial Framer Motion pass felt too subtle, so I asked for a stronger, more "premium SaaS" feel.
- Final stack: Framer Motion for state-driven interaction (spring physics, staggered reveals, page transitions) + anime.js for letter-by-letter hero text reveal + a custom canvas particle-network background (`ParticleField.jsx`) with mouse-repel physics.
- Built a custom animated robot mascot (`RobotMascot.jsx`) — SVG with cursor-tracking eyes, blinking, and mood states (idle/thinking/happy) that change per screen — plus a full-screen intro splash (`IntroScreen.jsx`) that "docks" into the corner mascot on first load.
- Fixed a real bug here: a gradient `background-clip: text` effect combined with per-character animation split was rendering invisible (opacity stuck at 0) in one browser — diagnosed and fixed by animating that line as a whole block instead of per-character.

---

## Phase 4 — "Blow their mind" feature pass

Explicitly asked Claude to suggest and build differentiators beyond the minimum spec:

- **Typewriter effect** on interviewer replies (character-reveal, not the whole reply appearing at once).
- **Voice input** via the browser's native Web Speech API — no external API cost, graceful hide on unsupported browsers.
- **Curriculum readiness radar chart** on the feedback screen — a Recharts radar plotting the candidate's *original* per-day mission signal (skipped/attempts/pass) against the days actually covered in the interview, so the "personalization" claim is visually provable, not just asserted in text.
- **PDF export** of the feedback report (jsPDF) and a clipboard "copy summary" action.
- **Sound design**: Web Audio API oscillator beeps (send/receive/complete), muted by default, no audio files.
- **Day-progress dots** and a live "Day X · Topic" badge in the chat header, sourced from real backend response fields (`currentFocus`, `progress`) added specifically to make the adaptive logic visible in the UI.

---

## Phase 5 — Bug fixes (real debugging, not cosmetic)

These were genuine bugs found through manual testing, not hypothetical edge cases:

1. **Premature-end bug**: if a candidate asked to end the interview before the minimum question threshold, the LLM would comply and send a "goodbye" reply, but the backend's coverage gate kept `done: false` — result: a confusing stuck state. Fixed by simplifying the end-condition to directly honor the model's `interviewComplete` signal (candidate intent takes priority), after first trying a more complex forced-redirect approach that proved too rigid.
2. **Silent error swallowing**: `ApiError` throws weren't logged anywhere, making a real Groq 429/502 failure look like "nothing happened" in the terminal. Added logging at every catch site.
3. **Feedback schema too strict**: `strengths`/`gaps`/`next` required `.min(1)`, which failed validation on short interviews where the LLM legitimately had nothing to put in one category. Relaxed to allow empty arrays, with a "None noted" UI fallback already in place.
4. **Scroll-position bug**: transitioning from a scrolled-down Chat screen to Feedback kept the old scroll offset, so the feedback screen opened mid-page. Fixed with a `window.scrollTo(0,0)` on every screen change.
5. **Card hover contrast**: a decorative hover glow was bleeding through the glassmorphic card background and washing out text. Fixed by increasing the card's own background opacity on hover instead of relying on the glow alone.

Debugging approach throughout: pasted real terminal/browser output back to Claude rather than describing symptoms, which let it pinpoint root causes (e.g. the missing `console.error` in the ApiError branch of the error handler) instead of guessing.

---

## Phase 6 — Edge cases & hardening

Explicitly asked for a review pass covering the brief's "handle real-world edge cases" requirement:

- Malformed/incomplete candidate objects → `400` with a clear message instead of a crash.
- Empty `missions` array → `topicSelector` falls back to early curriculum days.
- Network failure mid-interview → chat UI shows a retry button that resends the exact failed message (not a generic "try again" that loses the candidate's answer).
- `MAX_QUESTIONS` hard cap → prevents an unbounded interview if the model never signals completion.
- Empty candidate list / empty feedback arrays → explicit UI fallbacks rather than blank renders.

---

## Tools used

- **Claude** (Anthropic) — primary build partner for backend architecture, prompt engineering, animation implementation, and live debugging via pasted terminal/console output.
- **Groq API** (`llama-3.3-70b-versatile`, later switched to `llama-3.1-8b-instant` after hitting the free-tier daily token cap) for all LLM calls.
- No other AI code-gen tools were used for this problem statement.