# AI Usage Log

## Phase 0 — Scaffold
- Used Claude to scaffold project structure (monorepo: /server, /client),
  chai-aur-code style backend utils (asyncHandler, ApiError, ApiResponse),
  in-memory session store, topic-selection logic, Groq client wrapper,
  and the core /api/interview controller implementing start/continue/end
  turns per technical-spec.md.
- Prompt: "Build an Express backend for an AI interview agent matching this
  API contract [technical-spec.md], with adaptive question selection based
  on candidate weak signals from candidates.json, and structured feedback
  output validated against a zod schema."

