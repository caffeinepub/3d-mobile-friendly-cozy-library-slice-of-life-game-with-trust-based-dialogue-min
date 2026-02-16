# Specification

## Summary
**Goal:** Add an ambush-triggered chase for WhiteLatexBeast that immediately transitions into a continuously-updating chase, and only ends once the player escapes beyond a configured distance.

**Planned changes:**
- Update WhiteLatexBeast AI to add an "ambush" state that plays when the enemy first engages the player, then transitions directly into chase when ambush completes.
- Modify chase behavior so the enemy continuously tracks the player’s current position each frame (direction and facing update in real time).
- Change chase termination rules so chase persists after it starts and only ends when the player exceeds a configurable escape distance, then returns to existing wander behavior.
- Add/adjust tuning constants in `frontend/src/game/enemies/types.ts` for ambush + escape-distance chase, and ensure disabled enemies (e.g., during transfur encounter UI) do not move or advance AI/timers.

**User-visible outcome:** When a WhiteLatexBeast engages, it ambushes and then immediately begins a chase that actively follows the player’s movements, only giving up once the player gets far enough away.
