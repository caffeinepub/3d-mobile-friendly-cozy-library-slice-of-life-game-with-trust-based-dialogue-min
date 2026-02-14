import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { X, Search } from 'lucide-react';
import { toast } from 'sonner';

const hidingSpots = [
  { id: 1, name: 'Behind the tall bookshelf', difficulty: 'easy' },
  { id: 2, name: 'Under the reading table', difficulty: 'easy' },
  { id: 3, name: 'In the corner near the vent', difficulty: 'medium' },
  { id: 4, name: 'Behind the bonsai tree', difficulty: 'medium' },
  { id: 5, name: 'In the shadowy alcove', difficulty: 'hard' },
];

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export default function HideAndSeekMiniGame({ onComplete, onClose }: Props) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [found, setFound] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hidingSpot] = useState(() => hidingSpots[Math.floor(Math.random() * hidingSpots.length)]);
  const { adjustTrust } = useGameStore();

  useEffect(() => {
    if (found || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          toast.error('Time\'s up! Puro wins this round!');
          adjustTrust(3);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [found, timeLeft, adjustTrust]);

  const handleGuess = (spot: typeof hidingSpots[0]) => {
    setAttempts(prev => prev + 1);

    if (spot.id === hidingSpot.id) {
      setFound(true);
      const trustGain = timeLeft > 20 ? 10 : timeLeft > 10 ? 7 : 5;
      adjustTrust(trustGain);
      toast.success('You found Puro! He seems happy you found him so quickly!');
    } else {
      toast.error('Not there! Keep looking!');
      adjustTrust(-1);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hide and Seek</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Puro is hiding somewhere in the library. Can you find him?
            </p>
            <div className="text-3xl font-bold">
              {timeLeft}s
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Attempts: {attempts}
            </p>
          </div>

          {!found && timeLeft > 0 && (
            <div className="space-y-2">
              {hidingSpots.map(spot => (
                <Button
                  key={spot.id}
                  onClick={() => handleGuess(spot)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {spot.name}
                </Button>
              ))}
            </div>
          )}

          {(found || timeLeft === 0) && (
            <div className="space-y-3">
              <div className="text-center p-4 bg-muted rounded-lg">
                {found ? (
                  <>
                    <p className="font-semibold text-green-600">Found!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Puro was hiding {hidingSpot.name.toLowerCase()}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-orange-600">Time's Up!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Puro was hiding {hidingSpot.name.toLowerCase()}
                    </p>
                  </>
                )}
              </div>
              <Button onClick={handleFinish} className="w-full">
                Finish
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
