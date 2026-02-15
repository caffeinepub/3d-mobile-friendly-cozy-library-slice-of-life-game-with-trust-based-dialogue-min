# Specification

## Summary
**Goal:** Allow the game to be launched and played in an explicit Offline Mode when the backend is unreachable, using only locally persisted state.

**Planned changes:**
- Update the title screen so gameplay entry is not blocked when the server is offline, while keeping the existing server status indicator/alert for admins.
- Add clear English offline messaging on the title screen indicating the user can play and that progress is saved on the device.
- Update App.tsx launch behavior so “New Game” and “Continue” fall back to starting gameplay locally (without routing to a launch-error screen) when backend preflight/availability checks fail.
- Ensure the offline launch path makes no backend actor calls (e.g., startNewGame(), continueGame(), isAvailable()) and sets diagnostics to an English offline summary while preserving the user’s chosen action (new-game/continue).
- Add a local-save-present flag in the persisted Zustand store to drive “Continue” availability in offline mode (disable/communicate when no local save exists; load local state when it does).
- Verify core gameplay interactions remain functional without backend coupling or runtime errors while offline.

**User-visible outcome:** Users can start a new game or continue from the title screen even with no network/backend available, with progress stored locally on the device and clear English offline-mode messaging.
