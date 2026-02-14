# Specification

## Summary
**Goal:** Improve launch-time failure handling for New Game/Continue by detecting “canister is stopped” replica rejections, showing a clear user-friendly message, and allowing users to retry without refreshing.

**Planned changes:**
- Add centralized frontend error-normalization for launch-related backend call failures, producing consistent English summaries while preserving the raw error text for technical details.
- Detect IC replica rejection errors indicating a stopped canister (e.g., IC0508 / reject_code 5 with reject_message containing “is stopped”) for `startNewGame` and `continueGame`, and map them to a non-technical “server temporarily offline/stopped” summary.
- Update the launch error screen to include a “Retry” action that re-attempts the last failed launch action (New Game or Continue), shows retry-in-progress state, and prevents double-submission.

**User-visible outcome:** When New Game or Continue fails due to a stopped canister, the error screen displays a clear English explanation and still provides technical details; users can tap “Retry” to try the same launch action again without reloading the page.
