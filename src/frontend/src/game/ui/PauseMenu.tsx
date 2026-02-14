import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGameStore } from '../state/useGameStore';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';
import { useState } from 'react';
import SettingsScreen from './SettingsScreen';

interface Props {
  onResume: () => void;
  onBackToTitle: () => void;
}

export default function PauseMenu({ onResume, onBackToTitle }: Props) {
  const { resetProgress, setShowActivities, setShowMiniGames, setShowCustomization, setShowMoments, setShowLetters } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleReset = () => {
    resetProgress();
    onBackToTitle();
  };

  const handleOpenActivities = () => {
    onResume();
    setShowActivities(true);
  };

  const handleOpenMiniGames = () => {
    onResume();
    setShowMiniGames(true);
  };

  const handleOpenCustomization = () => {
    onResume();
    setShowCustomization(true);
  };

  const handleOpenMoments = () => {
    onResume();
    setShowMoments(true);
  };

  const handleOpenLetters = () => {
    onResume();
    setShowLetters(true);
  };

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/70 pointer-events-auto">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Paused</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={onResume} className="w-full justify-start" size="lg">
            <Play className="mr-2 h-5 w-5" />
            Resume
          </Button>

          <div className="border-t pt-2 mt-2">
            <p className="text-sm text-muted-foreground mb-2 px-2">Quick Access:</p>
            <Button onClick={handleOpenActivities} variant="outline" className="w-full justify-start">
              Activities
            </Button>
            <Button onClick={handleOpenMiniGames} variant="outline" className="w-full justify-start mt-1">
              Mini-Games
            </Button>
            <Button onClick={handleOpenCustomization} variant="outline" className="w-full justify-start mt-1">
              Customization
            </Button>
            <Button onClick={handleOpenMoments} variant="outline" className="w-full justify-start mt-1">
              Memorable Moments
            </Button>
            <Button onClick={handleOpenLetters} variant="outline" className="w-full justify-start mt-1">
              Letters
            </Button>
          </div>

          <div className="border-t pt-2 mt-2">
            <Button onClick={() => setShowSettings(true)} variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start mt-1">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all your progress, including trust level, unlocked moments, and customizations. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={onBackToTitle} variant="outline" className="w-full justify-start mt-1">
              <Home className="mr-2 h-5 w-5" />
              Return to Title
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
