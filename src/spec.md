# Specification

## Summary
**Goal:** Update the local-only admin username gate so admin mode unlocks only when the username entered is exactly `ADMIN` (case-sensitive), and ensure any previously persisted unlocked state is invalidated.

**Planned changes:**
- Change the admin unlock check to require an exact, case-sensitive match for the username `ADMIN` (no trimming; reject any non-exact input).
- Invalidate any previously persisted “admin unlocked” state that was granted under the old configured admin username, requiring re-entry of `ADMIN` after reload.
- Keep all existing admin-only UI gated by the updated admin unlock condition, and ensure “lock admin mode” still clears the persisted unlocked state.

**User-visible outcome:** Admin mode only unlocks when the user enters exactly `ADMIN`, and anyone previously unlocked under the old username will be locked again after reloading until they enter `ADMIN`.
