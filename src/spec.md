# Specification

## Summary
**Goal:** Remove the app’s local “Offline (Local)” mode and make frontend behavior always attempt backend availability checks and backend calls, with updated messaging and ops guidance that remains accurate about Internet Computer limitations.

**Planned changes:**
- Remove the Title Screen Online/Offline (server access) toggle and any UI/state/text referring to “Offline (Local)” or local-only backend access.
- Update server availability polling and backend call gating so backend checks run whenever the Title Screen is shown, and New Game/Continue depend only on backend-derived availability (Checking/Online/Offline).
- Simplify the server status indicator to use only backend-derived states (Checking, Online, Offline) and remove any `isLocalOffline` usage.
- Update Diagnostic Terminal `status` / `server status` commands to always attempt `actor.isAvailable()` and report Online/Offline based on results (English only).
- Revise user-facing help/error text to reflect always-online behavior without claiming the app can start/stop/restart or guarantee uptime for the backend canister.
- Update `frontend/OPS_CANISTER_AVAILABILITY.md` to emphasize operational steps to keep the canister running and funded with cycles, and cross-link to `frontend/DEPLOYMENT_TROUBLESHOOTING.md`.

**User-visible outcome:** The app no longer offers a local offline mode; it always checks the backend status and attempts backend actions, showing only Checking/Online/Offline states and providing accurate guidance when the backend is unavailable.
