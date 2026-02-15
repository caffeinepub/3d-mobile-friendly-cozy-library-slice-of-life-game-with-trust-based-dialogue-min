/**
 * Admin gate configuration
 * 
 * This is a local-only username gate (not secure authentication).
 * Change ADMIN_USERNAME to set who can access admin features.
 */

export const ADMIN_USERNAME = 'ADMIN';

// Storage key is derived from the username so that changing the username
// invalidates any previously persisted admin-unlocked state
export const ADMIN_GATE_STORAGE_KEY = `admin-gate-unlocked-${ADMIN_USERNAME}`;

