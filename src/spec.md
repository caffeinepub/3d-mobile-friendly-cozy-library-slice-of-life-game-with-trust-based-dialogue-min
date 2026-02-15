# Specification

## Summary
**Goal:** Add a developer-facing deployment troubleshooting guide for retrying failed network deployments and diagnosing common deployment failures for the Internet Computer app (in English).

**Planned changes:**
- Add a new markdown document with step-by-step instructions to retry deployment after a failure, including verifying canister status before re-deploying.
- Include a concise troubleshooting section covering common failure modes (build failure, identity/auth issues, canister stopped, out of cycles) with recommended next checks.
- Reference the existing canister availability operations guidance (frontend/OPS_CANISTER_AVAILABILITY.md) instead of duplicating it.

**User-visible outcome:** Developers can follow a clear markdown guide to retry failed deployments and troubleshoot typical network deployment issues, with pointers to existing canister availability guidance.
