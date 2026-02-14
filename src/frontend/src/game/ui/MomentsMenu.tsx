import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameStore } from '../state/useGameStore';
import { moments } from '../moments/momentsData';
import { X, Lock, Play } from 'lucide-react';
import { useState } from 'react';
import MomentPlayer from '../moments/MomentPlayer';

export default function MomentsMenu() {
  const { unlockedMoments, setShowMoments } = useGameStore();
  const [playingMoment, setPlayingMoment] = useState<typeof moments[0] | null>(null);

  if (playingMoment) {
    return (
      <MomentPlayer
        moment={playingMoment}
        onClose={() => setPlayingMoment(null)}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-2xl w-full max-h-[80vh]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Memorable Moments</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowMoments(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-3 pr-4">
              {moments.map(moment => {
                const isUnlocked = unlockedMoments.includes(moment.id);
                return (
                  <div
                    key={moment.id}
                    className={`border rounded-lg p-4 ${isUnlocked ? 'bg-card' : 'bg-muted/50'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          {isUnlocked ? moment.title : '???'}
                          {!isUnlocked && <Lock className="h-4 w-4" />}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isUnlocked ? moment.description : 'Unlock this moment by building trust with Puro.'}
                        </p>
                      </div>
                      {isUnlocked && (
                        <Button
                          onClick={() => setPlayingMoment(moment)}
                          size="sm"
                          variant="outline"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
