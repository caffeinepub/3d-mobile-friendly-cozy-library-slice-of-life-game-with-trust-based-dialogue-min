# Specification

## Summary
**Goal:** Make starting/continuing a game reliably transition from the Title screen into gameplay, and ensure any startup or rendering failures surface as clear, recoverable on-screen errors instead of appearing to “not start.”

**Planned changes:**
- Fix Title screen start actions (“New Game” and “Continue”) to consistently navigate to the gameplay view, with clear user-facing messaging if initialization or saved-state loading fails.
- Add a runtime error boundary around the gameplay rendering path (including the 3D canvas/scene) to catch exceptions and show a styled fallback UI with an optional technical details section and a “Back to Title” action.
- Harden startup and runtime asset loading so missing textures/audio do not block interactivity or gameplay; use safe fallbacks (e.g., fallback materials) and avoid blocking errors for audio issues.
- Add lightweight, non-sensitive diagnostics shown only when startup/gameplay mount fails, indicating which stage failed (e.g., startup initialization vs game view mount).

**User-visible outcome:** Clicking “New Game” or “Continue” reliably enters gameplay (3D view shows), and if something goes wrong the app shows a readable error screen with diagnostics and a “Back to Title” button rather than a blank/non-starting state.
