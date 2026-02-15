# Specification

## Summary
**Goal:** Trigger the existing secret event when the player avatar touches/collides with Puro in the 3D library scene.

**Planned changes:**
- Add a proximity/collision-radius check between the player avatar and Puro in the 3D library scene to trigger the existing secret event without requiring a click.
- Add a one-shot/cooldown guard so the touch-triggered secret event does not repeatedly fire every frame while the player remains in contact.
- Ensure the touch-triggered behavior stays benign (no harm/transformation) and that any new touch-specific on-screen text is English-only, while preserving Puro’s existing click interaction.

**User-visible outcome:** Players can trigger the same existing secret sequence by walking/joysticking into Puro (desktop or mobile), and it won’t continuously re-trigger while staying in contact.
