# Specification

## Summary
**Goal:** Add a new generated 3D “hive” (white latex forest) scene and teleport the player to it when touching the existing Puro model in the library.

**Planned changes:**
- Create a new React Three Fiber scene component for the hive: an original, procedurally generated 3D white/latex-like forest environment (no external model downloads or third-party/copyrighted assets).
- Implement a touch/proximity-based teleport trigger on the existing Puro model that transitions from the library scene to the hive scene and spawns the player at a defined hive spawn point.
- Add a one-shot + cooldown/hysteresis guard to prevent the teleport from firing repeatedly while the player remains in contact.
- Replace the current “touch Puro unlocks admin mode” behavior in `frontend/src/game/scene/LibraryScene.tsx` with the teleport-to-hive behavior, while keeping Puro click-to-open dialogue working as before.
- Ensure any new user-facing teleport feedback text (if shown) is English-only.

**User-visible outcome:** In the library scene, touching/approaching Puro teleports the player into a new generated 3D white latex forest (“the hive”), and gameplay/camera controls continue working normally in the new scene.
