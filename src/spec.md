# Specification

## Summary
**Goal:** Add a visible 3D player avatar that can move using existing desktop and mobile controls, and add a jump action with a dedicated on-screen Jump button.

**Planned changes:**
- Render a visible player character avatar (simple 3D mesh such as a capsule) at the player position in the 3D library scene.
- Hook the avatar’s horizontal movement to existing inputs: keyboard WASD/arrow keys on desktop and the existing on-screen joystick on touch devices.
- Ensure movement is disabled while the game is paused or while the diagnostic terminal is open, matching current input handling.
- Constrain player movement to the existing library bounds so the avatar cannot leave the playable area.
- Implement jump with Space on desktop and basic gravity + ground collision so the player lands back on the floor and cannot double-jump while airborne.
- Add a clearly visible on-screen mobile HUD button labeled “Jump” that triggers the same jump behavior and does not interfere with joystick interactions.

**User-visible outcome:** During gameplay, players see a character in the 3D library that moves with WASD/arrow keys or the mobile joystick, and can jump via Space or a labeled “Jump” button on touch devices (disabled while paused or when the diagnostic terminal is open).
