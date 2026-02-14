import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Moment } from './momentsData';

interface Props {
  moment: Moment;
  onClose: () => void;
}

export default function MomentPlayer({ moment, onClose }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/70 pointer-events-auto">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{moment.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-6xl">💭</div>
          </div>
          
          <p className="text-lg leading-relaxed">{moment.scene}</p>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
