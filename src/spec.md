# Specification

## Summary
**Goal:** Add a local, persistent “server access” toggle so users can enable/disable frontend calls to the backend canister and see clear UI feedback when disabled.

**Planned changes:**
- Add a clearly labeled in-app on/off switch for “Server access” that is persisted across page reloads.
- Integrate the toggle into the Title Screen: show an English “server access disabled locally” status message and disable New Game / Continue when OFF.
- Ensure that when server access is OFF, backend availability polling is not performed and backend calls for New Game / Continue are not attempted.
- Extend the Diagnostic Terminal with commands to set server access ON/OFF and update `help` output; make “server status” report that checks are disabled when server access is OFF.

**User-visible outcome:** Users can switch backend server access on/off locally, the setting persists after reload, the title screen reflects the disabled state (with New Game/Continue disabled), and the diagnostic terminal can control and explain the toggle.
