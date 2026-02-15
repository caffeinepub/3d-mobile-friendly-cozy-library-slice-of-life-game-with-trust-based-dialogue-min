# Specification

## Summary
**Goal:** Fix the React “Maximum update depth exceeded” error by preventing infinite update loops during gameplay initialization/mount.

**Planned changes:**
- Update `frontend/src/game/GameView.tsx` to guard gameplay initialization so `initializeGame(isNewGame)` runs only when appropriate (e.g., once per mount and/or only when `isNewGame` meaningfully changes), including resilience to React Strict Mode double-invocation.
- Stabilize effect dependencies involved in gameplay mount to prevent re-running initialization due to unstable function identities (e.g., memoize or restructure usage of `playBackgroundMusic` from `frontend/src/game/audio/useAudio.ts`).
- Ensure transitions from Title → Gameplay (New Game and Continue) no longer trigger repeated store resets or state updates that cause render/update loops.

**User-visible outcome:** Starting a New Game or Continuing a game reliably enters gameplay without console errors, and gameplay remains interactive after mount (HUD and mobile controls render normally).
