import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Settings, Info, Loader2 } from 'lucide-react';

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onSettings: () => void;
  onCredits: () => void;
  isLaunching?: boolean;
  continueDisabled?: boolean;
}

export default function TitleScreen({
  onNewGame,
  onContinue,
  onSettings,
  onCredits,
  isLaunching = false,
  continueDisabled = false,
}: TitleScreenProps) {
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

          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={onNewGame}
              size="lg"
              className="w-full text-lg"
              disabled={isLaunching}
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
              variant="secondary"
              size="lg"
              className="w-full text-lg"
              disabled={isLaunching || continueDisabled}
            >
              {isLaunching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Continue'
              )}
            </Button>

            <div className="flex gap-3 mt-2">
              <Button
                onClick={onSettings}
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={isLaunching}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>

              <Button
                onClick={onCredits}
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={isLaunching}
              >
                <Info className="mr-2 h-5 w-5" />
                Credits
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
