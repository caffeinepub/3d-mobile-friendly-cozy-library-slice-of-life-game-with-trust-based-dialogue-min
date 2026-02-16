# Specification

## Summary
**Goal:** Add glossy “White Latex Beast” enemies to the 3D hive scene that patrol/chase the player and trigger a non-graphic “transfur” encounter on contact, with outcomes persisted across reloads.

**Planned changes:**
- Add one or more White Latex Beast enemy entities (at minimum in the hive scene) with glossy white visual appearance and continuous movement AI (idle/patrol when far; chase within an aggro radius).
- Implement a “transfur” encounter on enemy capture/collision: show a brief screen effect + English message, temporarily prevent normal player control, then place the player into a defined post-encounter state (e.g., respawn at hive spawn position and/or apply a state change).
- Persist transformation outcomes in backend game state (e.g., boolean and/or counter), expose via existing state APIs, and sync/hydrate these fields on the frontend; add a conditional migration if the saved-state schema changes.

**User-visible outcome:** In the hive, the player will see moving glossy white enemies that chase them; getting caught triggers a short transformation event with an English message and a consistent consequence, and the game remembers transformation status across reloads/continue.
