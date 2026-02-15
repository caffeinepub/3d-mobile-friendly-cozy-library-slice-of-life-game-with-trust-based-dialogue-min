import { useState, useEffect } from 'react';
import TitleScreen from './ui/TitleScreen';
import CreditsScreen from './ui/CreditsScreen';
import SettingsScreen from './game/ui/SettingsScreen';
import GameView from './game/GameView';
import GameLaunchErrorScreen from './ui/GameLaunchErrorScreen';
import GameRuntimeErrorBoundary from './ui/GameRuntimeErrorBoundary';
import DiagnosticTerminalOverlay from './ui/DiagnosticTerminalOverlay';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { runStartup } from './startup';
import { useStartNewGame, useContinueGame } from './hooks/useQueries';
import { useBackendAvailability } from './hooks/useBackendAvailability';
import { normalizeLaunchError } from './utils/launchErrorNormalization';
import { useActor } from './hooks/useActor';

type Screen = 'title' | 'game' | 'settings' | 'credits' | 'launch-error';

interface DiagnosticsState {
  startupComplete: boolean;
  lastLaunchAction: 'new-game' | 'continue' | null;
  launchStage: 'idle' | 'calling-backend' | 'mounting-game' | 'complete' | 'failed';
  gameMounted: boolean;
  errorMessage: string | null;
  userFriendlySummary: string | null;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [isNewGame, setIsNewGame] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    startupComplete: false,
    lastLaunchAction: null,
    launchStage: 'idle',
    gameMounted: false,
    errorMessage: null,
    userFriendlySummary: null,
  });

  const startNewGameMutation = useStartNewGame();
  const continueGameMutation = useContinueGame();
  const { actor } = useActor();

  // Backend availability check - always active on title screen
  const backendAvailability = useBackendAvailability({
    enabled: currentScreen === 'title',
    refetchInterval: currentScreen === 'title' ? 30000 : undefined,
  });

  // Run startup sequence on mount
  useEffect(() => {
    runStartup()
      .then((result) => {
        if (result.success) {
          setIsReady(true);
          setDiagnostics((prev) => ({ ...prev, startupComplete: true }));
        } else {
          setStartupError(result.error || 'Startup failed');
          setIsReady(true); // Still allow app to load
          setDiagnostics((prev) => ({
            ...prev,
            startupComplete: false,
            errorMessage: result.error || 'Startup initialization failed',
            userFriendlySummary: 'Startup initialization failed',
          }));
        }
      })
      .catch((error) => {
        console.error('Unexpected startup error:', error);
        setStartupError('Unexpected error during startup');
        setIsReady(true); // Still allow app to load
        setDiagnostics((prev) => ({
          ...prev,
          startupComplete: false,
          errorMessage: 'Unexpected error during startup',
          userFriendlySummary: 'Unexpected error during startup',
        }));
      });
  }, []);

  const handleNewGame = async () => {
    // Preflight availability check
    if (!backendAvailability.isHealthy) {
      setDiagnostics({
        startupComplete: diagnostics.startupComplete,
        lastLaunchAction: 'new-game',
        launchStage: 'failed',
        gameMounted: false,
        errorMessage: backendAvailability.lastError || 'Game server is offline',
        userFriendlySummary: 'The game server is currently unavailable. This may be due to the canister being stopped, out of cycles, or network issues. Please try again later.',
      });
      setCurrentScreen('launch-error');
      return;
    }

    setDiagnostics({
      startupComplete: diagnostics.startupComplete,
      lastLaunchAction: 'new-game',
      launchStage: 'calling-backend',
      gameMounted: false,
      errorMessage: null,
      userFriendlySummary: null,
    });

    try {
      await startNewGameMutation.mutateAsync();
      setDiagnostics((prev) => ({ ...prev, launchStage: 'mounting-game' }));
      setIsNewGame(true);
      setCurrentScreen('game');
    } catch (error) {
      console.error('Failed to start new game:', error);
      const normalized = normalizeLaunchError(error, 'new-game');
      setDiagnostics((prev) => ({
        ...prev,
        launchStage: 'failed',
        errorMessage: normalized.rawError,
        userFriendlySummary: normalized.userSummary,
      }));
      setCurrentScreen('launch-error');
    }
  };

  const handleContinue = async () => {
    // Preflight availability check
    if (!backendAvailability.isHealthy) {
      setDiagnostics({
        startupComplete: diagnostics.startupComplete,
        lastLaunchAction: 'continue',
        launchStage: 'failed',
        gameMounted: false,
        errorMessage: backendAvailability.lastError || 'Game server is offline',
        userFriendlySummary: 'The game server is currently unavailable. This may be due to the canister being stopped, out of cycles, or network issues. Please try again later.',
      });
      setCurrentScreen('launch-error');
      return;
    }

    setDiagnostics({
      startupComplete: diagnostics.startupComplete,
      lastLaunchAction: 'continue',
      launchStage: 'calling-backend',
      gameMounted: false,
      errorMessage: null,
      userFriendlySummary: null,
    });

    try {
      await continueGameMutation.mutateAsync();
      setDiagnostics((prev) => ({ ...prev, launchStage: 'mounting-game' }));
      setIsNewGame(false);
      setCurrentScreen('game');
    } catch (error) {
      console.error('Failed to continue game:', error);
      const normalized = normalizeLaunchError(error, 'continue');
      setDiagnostics((prev) => ({
        ...prev,
        launchStage: 'failed',
        errorMessage: normalized.rawError,
        userFriendlySummary: normalized.userSummary,
      }));
      setCurrentScreen('launch-error');
    }
  };

  const handleRetry = async () => {
    if (!diagnostics.lastLaunchAction || isRetrying) {
      return;
    }

    setIsRetrying(true);

    try {
      if (diagnostics.lastLaunchAction === 'new-game') {
        await handleNewGame();
      } else {
        await handleContinue();
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const handleBackToTitle = () => {
    setDiagnostics({
      startupComplete: diagnostics.startupComplete,
      lastLaunchAction: null,
      launchStage: 'idle',
      gameMounted: false,
      errorMessage: null,
      userFriendlySummary: null,
    });
    setIsRetrying(false);
    setCurrentScreen('title');
  };

  const handleGameMounted = () => {
    setDiagnostics((prev) => ({
      ...prev,
      launchStage: 'complete',
      gameMounted: true,
    }));
  };

  const handleGameMountError = (error: string) => {
    setDiagnostics((prev) => ({
      ...prev,
      launchStage: 'failed',
      gameMounted: false,
      errorMessage: error,
      userFriendlySummary: 'Game view failed to load',
    }));
    setCurrentScreen('launch-error');
  };

  // Terminal server status check function
  const checkServerStatus = async (): Promise<{ healthy: boolean; error?: string }> => {
    if (!actor) {
      return { healthy: false, error: 'Backend actor is not initialized yet' };
    }

    try {
      const result = await actor.isAvailable();
      return { healthy: result === true };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  // Show loading state during startup
  if (!isReady) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="animate-pulse text-2xl font-serif text-foreground">
              Loading...
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const isLaunching =
    startNewGameMutation.isPending ||
    continueGameMutation.isPending ||
    diagnostics.launchStage === 'mounting-game' ||
    isRetrying;

  // Prepare diagnostics for terminal
  const terminalDiagnostics = {
    currentScreen,
    ...diagnostics,
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="w-full h-screen overflow-hidden">
        {startupError && currentScreen === 'title' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm max-w-md text-center">
            Warning: {startupError}
          </div>
        )}
        {currentScreen === 'title' && (
          <TitleScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            onSettings={() => setCurrentScreen('settings')}
            onCredits={() => setCurrentScreen('credits')}
            isLaunching={isLaunching}
            continueDisabled={false}
            backendAvailability={backendAvailability}
          />
        )}
        {currentScreen === 'game' && (
          <GameRuntimeErrorBoundary onBackToTitle={handleBackToTitle}>
            <GameView
              isNewGame={isNewGame}
              onBackToTitle={handleBackToTitle}
              onMounted={handleGameMounted}
              onMountError={handleGameMountError}
            />
          </GameRuntimeErrorBoundary>
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen onBack={() => setCurrentScreen('title')} />
        )}
        {currentScreen === 'credits' && (
          <CreditsScreen onBack={() => setCurrentScreen('title')} />
        )}
        {currentScreen === 'launch-error' && (
          <GameLaunchErrorScreen
            diagnostics={diagnostics}
            onBackToTitle={handleBackToTitle}
            onRetry={handleRetry}
            isRetrying={isRetrying}
          />
        )}
        <DiagnosticTerminalOverlay
          diagnostics={terminalDiagnostics}
          checkServerStatus={checkServerStatus}
        />
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
}
