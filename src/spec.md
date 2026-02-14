# Specification

## Summary
**Goal:** Improve game canister availability handling by adding a backend health/availability check and frontend preflight UI so players get clear feedback when the server is offline/stopped.

**Planned changes:**
- Add a lightweight, non-throwing backend availability query method in `backend/main.mo` that returns successfully when the canister is running and does not depend on saved game state.
- Add a frontend preflight availability check on the Title screen and immediately before New Game / Continue; disable or warn with clear English text when the server is offline/stopped.
- Add retry/periodic recheck behavior so the Title screen updates to “healthy” without requiring a full page refresh.
- Add a small developer-facing operations document describing how to keep the canister online in production (started, funded with cycles) and clarifying that a stopped canister cannot be restarted programmatically by the canister itself.

**User-visible outcome:** Players see an immediate server status check on the Title screen; if the game server is offline/stopped, New Game/Continue is disabled or shows an English warning, and the UI can recover automatically once the backend is available again.
