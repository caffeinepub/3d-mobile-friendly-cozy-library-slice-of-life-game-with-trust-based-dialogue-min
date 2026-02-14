import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useGameStore } from '../state/useGameStore';

export default function TrustMeter() {
  const { trustLevel } = useGameStore();

  const getTrustLabel = () => {
    if (trustLevel < 20) return 'Very Low';
    if (trustLevel < 40) return 'Low';
    if (trustLevel < 60) return 'Neutral';
    if (trustLevel < 80) return 'Good';
    return 'Excellent';
  };

  const getTrustColor = () => {
    if (trustLevel < 20) return 'text-destructive';
    if (trustLevel < 40) return 'text-orange-500';
    if (trustLevel < 60) return 'text-yellow-500';
    if (trustLevel < 80) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <Card className="p-3 bg-card/80 backdrop-blur-sm pointer-events-auto min-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <Heart className={`h-4 w-4 ${getTrustColor()}`} />
        <span className="text-sm font-semibold">Trust: {getTrustLabel()}</span>
      </div>
      <Progress value={trustLevel} className="h-2" />
      <div className="text-xs text-muted-foreground mt-1 text-right">{trustLevel}/100</div>
    </Card>
  );
}
