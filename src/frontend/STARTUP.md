# Application Startup

## Overview

This document describes the startup flow for the Puro Hangout game application.

## Startup File

**Location:** `frontend/src/startup.ts`

The startup module is responsible for one-time initialization tasks that must complete before gameplay begins:

- **Critical Asset Preloading**: Preloads essential UI assets (menu background, game logo) to ensure they're available immediately when needed
- **Storage Availability Check**: Verifies that localStorage is accessible for Zustand store persistence
- **Idempotent Execution**: The `runStartup()` function is guarded to ensure it only runs once, even if called multiple times

## Invocation

**Location:** `frontend/src/App.tsx`

The startup sequence is invoked from the main App component:

1. On component mount, `useEffect` calls `runStartup()`
2. While startup is in progress, a loading screen is displayed
3. Once startup completes (success or failure), the normal UI flow is rendered
4. If startup encounters errors, a warning banner is shown but the app continues to load

## API

### `runStartup(): Promise<StartupResult>`

Executes the startup sequence. Returns a promise that resolves with:
- `{ success: true }` on successful initialization
- `{ success: false, error: string }` if initialization fails

### `resetStartup(): void`

Resets the startup state (primarily for testing purposes).

## Extending Startup

To add new initialization tasks:

1. Add your initialization logic to `runStartup()` in `frontend/src/startup.ts`
2. Ensure your code handles errors gracefully (use try-catch)
3. Consider whether failures should block app loading or just show warnings
4. Keep startup tasks lightweight to minimize initial load time
