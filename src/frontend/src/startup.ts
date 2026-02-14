/**
 * Application startup module
 * Handles one-time initialization before gameplay begins
 */

let hasStarted = false;

interface StartupResult {
  success: boolean;
  error?: string;
}

interface AssetLoadResult {
  src: string;
  success: boolean;
}

/**
 * Preload critical static assets used by early UI
 */
async function preloadCriticalAssets(): Promise<AssetLoadResult[]> {
  const criticalAssets = [
    '/assets/generated/menu-library-bg.dim_1920x1080.png',
    '/assets/generated/game-logo.dim_1024x512.png',
  ];

  const results = await Promise.all(
    criticalAssets.map(
      (src) =>
        new Promise<AssetLoadResult>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ src, success: true });
          img.onerror = () => {
            console.warn(`Failed to preload asset: ${src}`);
            resolve({ src, success: false });
          };
          img.src = src;
        })
    )
  );

  return results;
}

/**
 * Check if localStorage is available and working
 */
function checkStorageAvailability(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    return false;
  }
}

/**
 * Run one-time startup sequence
 * This function is idempotent and safe to call multiple times
 */
export async function runStartup(): Promise<StartupResult> {
  // Guard against multiple invocations
  if (hasStarted) {
    return { success: true };
  }

  try {
    // Check storage availability for Zustand persistence
    const storageAvailable = checkStorageAvailability();
    if (!storageAvailable) {
      console.warn('Game progress persistence may not work correctly');
    }

    // Preload critical assets (non-blocking)
    const assetResults = await preloadCriticalAssets();
    const failedAssets = assetResults.filter((r) => !r.success);
    if (failedAssets.length > 0) {
      console.warn(`${failedAssets.length} asset(s) failed to preload, but continuing startup`);
    }

    // Mark startup as complete
    hasStarted = true;

    return { success: true };
  } catch (error) {
    console.error('Startup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Reset startup state (useful for testing)
 */
export function resetStartup(): void {
  hasStarted = false;
}
