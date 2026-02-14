import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { getEnding } from './endings';
import { Home, RotateCcw } from 'lucide-react';

interface Props {
  onBackToTitle: () => void;
}

export default function EndingScene({ onBackToTitle }: Props) {
  const { trustLevel, unlockEnding, resetProgress } = useGameStore();
  const [ending, setEnding] = useState(getEnding(trustLevel));

  useEffect(() => {
    const currentEnding = getEnding(trustLevel);
    setEnding(currentEnding);
    unlockEnding(currentEnding.id);
  }, [trustLevel, unlockEnding]);

  const handleNewGame = () => {
    resetProgress();
    onBackToTitle();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/90 pointer-events-auto">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{ending.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-8xl">
              {ending.id === 'good' && '🌟'}
              {ending.id === 'purlin-fusion' && '🔄'}
              {ending.id === 'complete-assimilation' && '💔'}
            </div>
          </div>

          <p className="text-lg leading-relaxed whitespace-pre-line">{ending.scene}</p>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Final Trust Level: {trustLevel}/100
            </p>
            <div className="flex gap-3">
              <Button onClick={handleNewGame} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                New Game
              </Button>
              <Button onClick={onBackToTitle} variant="outline" className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Title Screen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
