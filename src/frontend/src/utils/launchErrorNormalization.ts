/**
 * Centralized launch error normalization utility.
 * Inspects raw actor-call errors and returns user-friendly English summaries
 * while preserving raw error text for technical details.
 */

export interface NormalizedError {
  userSummary: string;
  rawError: string;
  category: 'NO_SAVED_GAME' | 'CANISTER_STOPPED' | 'CONNECTIVITY' | 'UNKNOWN';
}

export function normalizeLaunchError(error: unknown, action: 'new-game' | 'continue'): NormalizedError {
  const rawError = error instanceof Error ? error.message : String(error);

  // Check for stopped canister (IC0508, reject_code 5, "is stopped")
  if (
    rawError.includes('IC0508') ||
    rawError.includes('reject_code: 5') ||
    rawError.includes('is stopped') ||
    rawError.includes('Canister') && rawError.includes('stopped')
  ) {
    return {
      userSummary: 'The game server is temporarily offline. Please try again in a moment.',
      rawError,
      category: 'CANISTER_STOPPED',
    };
  }

  // Check for no saved game (continue action specific)
  if (
    action === 'continue' &&
    (rawError.includes('No saved game found') || rawError.includes('Game state not found'))
  ) {
    return {
      userSummary: 'No saved game found. Please start a new game.',
      rawError,
      category: 'NO_SAVED_GAME',
    };
  }

  // Check for general connectivity issues
  if (
    rawError.includes('network') ||
    rawError.includes('timeout') ||
    rawError.includes('fetch') ||
    rawError.includes('connection')
  ) {
    return {
      userSummary: 'Unable to connect to the game server. Please check your connection and try again.',
      rawError,
      category: 'CONNECTIVITY',
    };
  }

  // Generic fallback
  return {
    userSummary: action === 'new-game'
      ? 'Failed to start a new game. Please try again.'
      : 'Failed to continue game. Please try again or start a new game.',
    rawError,
    category: 'UNKNOWN',
  };
}
