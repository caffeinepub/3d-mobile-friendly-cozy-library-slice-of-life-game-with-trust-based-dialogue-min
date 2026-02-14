import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAudioManager } from '../audio/useAudio';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: Props) {
  const { volume, isMuted, setVolume, toggleMute } = useAudioManager();

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mute">Mute Audio</Label>
              <Switch
                id="mute"
                checked={isMuted}
                onCheckedChange={toggleMute}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Music Volume</Label>
              <Slider
                id="volume"
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={([v]) => setVolume(v)}
                disabled={isMuted}
              />
              <p className="text-xs text-muted-foreground text-right">{volume}%</p>
            </div>
          </div>

          <Button onClick={onBack} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
