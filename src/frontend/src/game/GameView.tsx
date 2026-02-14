import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import LibraryScene from './scene/LibraryScene';
import { useGameStore } from './state/useGameStore';
import TrustMeter from './ui/TrustMeter';
import DialoguePanel from './ui/DialoguePanel';
import ActivityMenu from './ui/ActivityMenu';
import MiniGameLauncher from './minigames/MiniGameLauncher';
import CustomizationPanel from './ui/CustomizationPanel';
import MomentsMenu from './ui/MomentsMenu';
import LettersPanel from './ui/LettersPanel';
import PauseMenu from './ui/PauseMenu';
import EndingScene from './story/EndingScene';
import MobileControlsOverlay from './controls/MobileControlsOverlay';
import { useAudioManager } from './audio/useAudio';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameViewProps {
  isNewGame: boolean;
  onBackToTitle: () => void;
  onMounted?: () => void;
  onMountError?: (error: string) => void;
}

export default function GameView({ isNewGame, onBackToTitle, onMounted, onMountError }: GameViewProps) {
  const {
    initializeGame,
    showDialogue,
    showActivities,
    showMiniGames,
    showCustomization,
    showMoments,
    showLetters,
    showEnding,
    isPaused,
    setPaused,
  } = useGameStore();
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [canvasMounted, setCanvasMounted] = useState(false);
  const { playBackgroundMusic } = useAudioManager();

  useEffect(() => {
    try {
      initializeGame(isNewGame);
      playBackgroundMusic();
    } catch (error) {
      console.error('Failed to initialize game:', error);
      onMountError?.(error instanceof Error ? error.message : 'Failed to initialize game');
    }
  }, [isNewGame, initializeGame, playBackgroundMusic, onMountError]);

  const handleCanvasCreated = () => {
    setCanvasMounted(true);
    // Give the scene a moment to render before signaling success
    setTimeout(() => {
      onMounted?.();
    }, 100);
  };

  const handlePause = () => {
    setPaused(true);
    setShowPauseMenu(true);
  };

  const handleResume = () => {
    setPaused(false);
    setShowPauseMenu(false);
  };

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 60 }}
        className="w-full h-full"
        onCreated={handleCanvasCreated}
      >
        <LibraryScene />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 pointer-events-none">
        <div className="flex justify-between items-start">
          <TrustMeter />
          <Button
            onClick={handlePause}
            variant="outline"
            size="icon"
            className="pointer-events-auto bg-card/80 backdrop-blur-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Controls */}
      <MobileControlsOverlay />

      {/* UI Panels */}
      {showDialogue && <DialoguePanel />}
      {showActivities && <ActivityMenu />}
      {showMiniGames && <MiniGameLauncher />}
      {showCustomization && <CustomizationPanel />}
      {showMoments && <MomentsMenu />}
      {showLetters && <LettersPanel />}
      {showEnding && <EndingScene onBackToTitle={onBackToTitle} />}
      {showPauseMenu && <PauseMenu onResume={handleResume} onBackToTitle={onBackToTitle} />}
    </div>
  );
}
