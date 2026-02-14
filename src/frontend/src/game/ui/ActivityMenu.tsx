import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { activities } from '../activities/activities';
import { X, BookOpen, Ear, Apple } from 'lucide-react';
import { toast } from 'sonner';

export default function ActivityMenu() {
  const { adjustTrust, completeActivity, setShowActivities, unlockMoment } = useGameStore();

  const handleActivity = (activity: typeof activities[0]) => {
    adjustTrust(activity.trustEffect);
    completeActivity(activity.id, activity.trustEffect);
    toast.success(activity.completionMessage);
    
    // Check for moment unlocks
    if (activity.unlocksMoment) {
      unlockMoment(activity.unlocksMoment);
    }
    
    setShowActivities(false);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'read': return <BookOpen className="h-5 w-5" />;
      case 'stories': return <Ear className="h-5 w-5" />;
      case 'feed': return <Apple className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activities with Puro</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowActivities(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((activity) => (
            <Button
              key={activity.id}
              onClick={() => handleActivity(activity)}
              variant="outline"
              className="w-full justify-start h-auto py-4 px-4"
            >
              <div className="flex items-start gap-3 w-full">
                {getIcon(activity.id)}
                <div className="flex-1 text-left">
                  <div className="font-semibold">{activity.name}</div>
                  <div className="text-sm text-muted-foreground">{activity.description}</div>
                </div>
                <span className={`text-xs ${activity.trustEffect > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                  +{activity.trustEffect}
                </span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
