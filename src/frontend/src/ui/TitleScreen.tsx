import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Settings, Info, Loader2, AlertCircle, RefreshCw, Terminal } from 'lucide-react';
import type { BackendAvailabilityState } from '../hooks/useBackendAvailability';
import { useTerminalStore } from './terminal/useTerminalStore';
import { useAdminGateStore } from '../state/useAdminGateStore';
import ServerStatusIndicator from './ServerStatusIndicator';
import AdminAccessPanel from './AdminAccessPanel';

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onSettings: () => void;
  onCredits: () => void;
  isLaunching?: boolean;
  continueDisabled?: boolean;
  backendAvailability?: BackendAvailabilityState;
}

export default function TitleScreen({
  onNewGame,
  onContinue,
  onSettings,
  onCredits,
  isLaunching = false,
  continueDisabled = false,
  backendAvailability,
}: TitleScreenProps) {
  const { open: openTerminal } = useTerminalStore();
  const { isUnlocked: isAdminUnlocked } = useAdminGateStore();
  
  const isServerOffline = backendAvailability && !backendAvailability.isHealthy && !backendAvailability.isChecking;
  const isCheckingServer = backendAvailability?.isChecking;

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/assets/generated/menu-library-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <Card className="relative z-10 p-8 max-w-md w-full mx-4 bg-card/95 backdrop-blur-sm border-2">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/assets/generated/game-logo.dim_1024x512.png"
            alt="Cozy Library"
            className="w-full max-w-sm"
          />

          {/* Admin Access Panel */}
          <AdminAccessPanel />

          {/* Server Status Indicator - Only visible when admin unlocked */}
          {isAdminUnlocked && (
            <div className="w-full space-y-3">
              <div className="flex justify-center">
                <ServerStatusIndicator backendAvailability={backendAvailability} />
              </div>
            </div>
          )}

          {/* Server Offline Alert - only shown when admin unlocked */}
          {isAdminUnlocked && isServerOffline && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Server Unavailable</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <span>
                  The backend canister is currently unavailable. This may be due to the canister being stopped, out of cycles, or network issues. Please try again later.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => backendAvailability.refetch()}
                  className="w-fit mt-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={onNewGame}
              size="lg"
              className="w-full text-lg"
              disabled={isLaunching || isServerOffline || isCheckingServer}
            >
              {isLaunching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" />
                  New Game
                </>
              )}
            </Button>

            <Button
              onClick={onContinue}
              variant="outline"
              size="lg"
              className="w-full text-lg"
              disabled={isLaunching || continueDisabled || isServerOffline || isCheckingServer}
            >
              Continue
            </Button>

            <div className="flex gap-2 w-full mt-2">
              <Button
                onClick={onSettings}
                variant="ghost"
                size="lg"
                className="flex-1"
                disabled={isLaunching}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>

              <Button
                onClick={onCredits}
                variant="ghost"
                size="lg"
                className="flex-1"
                disabled={isLaunching}
              >
                <Info className="mr-2 h-5 w-5" />
                Credits
              </Button>
            </div>

            {/* Terminal Button - Only visible when admin unlocked */}
            {isAdminUnlocked && (
              <Button
                onClick={openTerminal}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <Terminal className="mr-2 h-4 w-4" />
                Diagnostic Terminal
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
