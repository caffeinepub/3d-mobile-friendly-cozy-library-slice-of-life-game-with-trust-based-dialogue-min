# Specification

## Summary
**Goal:** Build a mobile-friendly 3D cozy library slice-of-life game in the browser featuring trust-based dialogue, daily activities, mini-games, customization, letters, memorable moments, and multiple endings.

**Planned changes:**
- Create a single-location 3D library scene (bookshelves, at least one vent, central fruit-bearing bonsai) that the player can move around in using React Three Fiber.
- Add mobile touch controls (on-screen movement + touch camera gestures) with desktop keyboard/mouse fallback.
- Implement a Trust/Friendship relationship meter with thresholds that alter dialogue openness and story outcomes; persist per user/session across refresh.
- Add a dialogue tree with multiple-choice branching for conversations with Puro, including topics on lab backstory, the Pale virus, and fascination with humans; choices modify trust and are saved.
- Implement a hangout/daily routine loop with activities: reading together, listening to stories, and feeding oranges via a visible bonsai fruit interaction.
- Add three replayable mini-games inside the library: Book Sorting, Drawing Lessons/Viewing Drawings, and Hide-and-Seek; each has a clear completion condition and affects trust.
- Add library customization: discover at least 5 decor items via vent interactions, place/remove them at predefined points, and persist placements.
- Ensure close contact with Puro is always benign (no transfurring mechanic); show a safe reaction and continue gameplay.
- Implement story progression with multiple endings based on trust thresholds: Good Ending, Betrayal (Complete Assimilation), Betrayal (Purlin Fusion), each with an end scene and credits/return-to-menu.
- Add “Memorable Moments” to unlock and replay at least 2 heartwarming scenes; persist unlocks and avoid changing trust (or clearly indicate if it does).
- Add a letter writing system: compose short letters, submit via vent, view sent letters and receive at least one friendly in-game response per letter using predefined templates/logic; persist data.
- Set calm/cozy/slightly melancholic tone with English text, lofi retro-style piano background music, and basic audio toggles.
- Apply a consistent retro-inspired 3D visual style that nods to pixel-art aesthetics across the scene, UI, and mini-games; create a cohesive cozy UI theme avoiding a blue/purple-dominant palette.
- Add basic game state management: title screen with New/Continue, settings (audio), credits/about; autosave on key events and provide reset progress.

**User-visible outcome:** Players can explore a cozy 3D library on mobile or desktop, talk with Puro through branching dialogue that changes with trust, do daily activities and mini-games, customize the library with vent-found items, write letters and receive responses, revisit unlocked moments, and reach different endings based on their trust level.
