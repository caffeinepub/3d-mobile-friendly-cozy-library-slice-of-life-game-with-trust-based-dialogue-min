import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface DiagnosticsState {
  startupComplete: boolean;
  lastLaunchAction: 'new-game' | 'continue' | null;
  launchStage: 'idle' | 'calling-backend' | 'mounting-game' | 'complete' | 'failed';
  gameMounted: boolean;
  errorMessage: string | null;
  userFriendlySummary: string | null;
}

interface GameLaunchErrorScreenProps {
  diagnostics: DiagnosticsState;
  onBackToTitle: () => void;
  onRetry: () => void;
  isRetrying: boolean;
}

export default function GameLaunchErrorScreen({
  diagnostics,
  onBackToTitle,
  onRetry,
  isRetrying,
}: GameLaunchErrorScreenProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getErrorSummary = () => {
    // Use normalized user-friendly summary if available
    if (diagnostics.userFriendlySummary) {
      return diagnostics.userFriendlySummary;
    }

    // Fallback to legacy logic
    if (!diagnostics.startupComplete) {
      return 'Startup initialization failed';
    }
    if (diagnostics.lastLaunchAction === 'continue' && diagnostics.launchStage === 'failed') {
      return 'No saved game found. Please start a new game.';
    }
    if (diagnostics.launchStage === 'calling-backend') {
      return 'Failed to connect to game server';
    }
    if (diagnostics.launchStage === 'mounting-game') {
      return 'Game view failed to load';
    }
    return 'An unexpected error occurred';
  };

  const getDetailedInfo = (): string[] => {
    const details: string[] = [];
    details.push(`Startup: ${diagnostics.startupComplete ? 'Complete' : 'Failed'}`);
    if (diagnostics.lastLaunchAction) {
      details.push(`Action: ${diagnostics.lastLaunchAction === 'new-game' ? 'New Game' : 'Continue'}`);
    }
    details.push(`Stage: ${diagnostics.launchStage}`);
    details.push(`Game Mounted: ${diagnostics.gameMounted ? 'Yes' : 'No'}`);
    if (diagnostics.errorMessage) {
      details.push(`Error: ${diagnostics.errorMessage}`);
    }
    return details;
  };

  const canRetry = diagnostics.lastLaunchAction !== null;

  return (
    <div className="w-full h-full flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle className="text-xl">Unable to Start Game</CardTitle>
              <CardDescription className="mt-1">{getErrorSummary()}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {diagnostics.lastLaunchAction === 'continue' &&
            diagnostics.userFriendlySummary?.includes('No saved game')
              ? 'It looks like there is no saved game to continue. Try starting a new game instead.'
              : 'The game encountered an issue while starting. The backend canister may be stopped, out of cycles, or experiencing network issues. Please try again later or return to the title screen.'}
          </p>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showDetails ? 'Hide' : 'Show'} technical details
          </button>

          {showDetails && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-xs font-mono">
              {getDetailedInfo().map((detail, index) => (
                <div key={index}>{detail}</div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {canRetry && (
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex-1"
              size="lg"
              variant="default"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </>
              )}
            </Button>
          )}
          <Button
            onClick={onBackToTitle}
            className={canRetry ? 'flex-1' : 'w-full'}
            size="lg"
            variant={canRetry ? 'outline' : 'default'}
          >
            Back to Title
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
