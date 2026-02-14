import { useState } from 'react';
import TitleScreen from './ui/TitleScreen';
import CreditsScreen from './ui/CreditsScreen';
import SettingsScreen from './game/ui/SettingsScreen';
import GameView from './game/GameView';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

type Screen = 'title' | 'game' | 'settings' | 'credits';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [isNewGame, setIsNewGame] = useState(false);

  const handleNewGame = () => {
    setIsNewGame(true);
    setCurrentScreen('game');
  };

  const handleContinue = () => {
    setIsNewGame(false);
    setCurrentScreen('game');
  };

  const handleBackToTitle = () => {
    setCurrentScreen('title');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="w-full h-screen overflow-hidden">
        {currentScreen === 'title' && (
          <TitleScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            onSettings={() => setCurrentScreen('settings')}
            onCredits={() => setCurrentScreen('credits')}
          />
        )}
        {currentScreen === 'game' && (
          <GameView isNewGame={isNewGame} onBackToTitle={handleBackToTitle} />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen onBack={() => setCurrentScreen('title')} />
        )}
        {currentScreen === 'credits' && (
          <CreditsScreen onBack={() => setCurrentScreen('title')} />
        )}
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
}
