# Specification

## Summary
**Goal:** Update mobile look/aim controls so players can look around by dragging anywhere on the right side of the screen, instead of only within the small “Look” widget.

**Planned changes:**
- Add a large right-side touch/drag input area (e.g., right half of the screen) that drives camera yaw/pitch using the existing look delta pipeline (usePlayerControls -> usePlayerControlsStore -> scene camera rotation).
- Ensure the left-side joystick/movement touch area remains dedicated to movement input and is not affected by the new look area.
- Implement robust touch start/end handling for the right-side look drag so deltas begin immediately on touch down, reset cleanly on release, and do not cause jumps or drift.
- Respect existing disabled behavior by disabling right-side look drag while the game is paused or the diagnostic terminal is open.

**User-visible outcome:** On touch devices, players can smoothly look around by dragging on the right side of the screen, with movement controls unchanged on the left and no jitter/jump when starting or ending a drag.
