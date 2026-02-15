# Specification

## Summary
**Goal:** Add a local-only, username-based admin mode that gates admin-only UI switches and Diagnostic Terminal access.

**Planned changes:**
- Add a single configurable admin username value in a small frontend config module.
- Add an in-app admin access UI where the user can enter a username to unlock admin mode, with clear English messaging that this is not secure authentication.
- Persist admin mode state across page reloads (e.g., via local storage).
- Hide Title Screen admin-only controls unless admin mode is unlocked (server access toggle, server status indicator, and Diagnostic Terminal button), while keeping existing persisted server access behavior for New Game/Continue.
- Hide gameplay admin-only controls unless admin mode is unlocked (Pause Menu Diagnostic Terminal button and the Ctrl+` / Cmd+` shortcut).
- Provide a “Lock Admin Mode” / “Log out” action in the same admin access UI to clear stored admin state and immediately re-hide admin-only controls.

**User-visible outcome:** Users can enter a specific username to unlock admin-only controls and Diagnostic Terminal access, see clear feedback about locked/unlocked state, and lock/logout admin mode to hide those controls again; non-admin users won’t see or be able to trigger the admin-only UI.
