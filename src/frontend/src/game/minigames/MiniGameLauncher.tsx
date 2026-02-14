import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { X } from 'lucide-react';
import BookSortingMiniGame from './BookSortingMiniGame';
import DrawingMiniGame from './DrawingMiniGame';
import HideAndSeekMiniGame from './HideAndSeekMiniGame';

type MiniGame = 'menu' | 'booksorting' | 'drawing' | 'hideandseek';

export default function MiniGameLauncher() {
  const [currentGame, setCurrentGame] = useState<MiniGame>('menu');
  const { setShowMiniGames } = useGameStore();

  const handleClose = () => {
    setShowMiniGames(false);
    setCurrentGame('menu');
  };

  const handleGameComplete = () => {
    setCurrentGame('menu');
  };

  if (currentGame === 'booksorting') {
    return <BookSortingMiniGame onComplete={handleGameComplete} onClose={handleClose} />;
  }

  if (currentGame === 'drawing') {
    return <DrawingMiniGame onComplete={handleGameComplete} onClose={handleClose} />;
  }

  if (currentGame === 'hideandseek') {
    return <HideAndSeekMiniGame onComplete={handleGameComplete} onClose={handleClose} />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mini-Games</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => setCurrentGame('booksorting')}
            variant="outline"
            className="w-full justify-start h-auto py-4"
          >
            <div className="text-left">
              <div className="font-semibold">Book Sorting</div>
              <div className="text-sm text-muted-foreground">Help Puro organize the library shelves</div>
            </div>
          </Button>

          <Button
            onClick={() => setCurrentGame('drawing')}
            variant="outline"
            className="w-full justify-start h-auto py-4"
          >
            <div className="text-left">
              <div className="font-semibold">Drawing Lessons</div>
              <div className="text-sm text-muted-foreground">View Puro's drawings and art</div>
            </div>
          </Button>

          <Button
            onClick={() => setCurrentGame('hideandseek')}
            variant="outline"
            className="w-full justify-start h-auto py-4"
          >
            <div className="text-left">
              <div className="font-semibold">Hide and Seek</div>
              <div className="text-sm text-muted-foreground">Play a gentle game among the bookshelves</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
