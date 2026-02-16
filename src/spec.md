# Specification

## Summary
**Goal:** Fix runtime/React issues and redesign the Puro character to a stylized, clearly non-3D look while preserving current gameplay.

**Planned changes:**
- Scan and fix/remove runtime errors, React warnings, and obvious logic bugs without changing intended gameplay behavior.
- Refactor Library scene texture loading to follow valid React Hooks rules while keeping the wood-texture fallback behavior.
- Refactor per-frame movement/jump/camera logic in Library and Hive scenes to avoid updating React state inside `useFrame` (move per-frame physics state to refs or other non-rendering storage) while preserving movement feel, collisions, and Hive enemy chase behavior.
- Replace the current basic 3D capsule/sphere Puro model with a flat/stylized non-3D rendering approach (e.g., sprite/billboard or toon-flat) that remains positioned/interactable, including click-to-dialogue and hover feedback.
- Add and load new Puro image assets from `frontend/public/assets/generated/` directly in the frontend (no backend routing).

**User-visible outcome:** The game builds cleanly, Library and Hive remain playable with stable performance, and Puro appears as a stylized non-3D character with working hover and dialogue interactions.
