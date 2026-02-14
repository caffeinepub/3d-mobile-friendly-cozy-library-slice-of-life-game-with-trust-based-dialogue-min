import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const drawings = [
  {
    id: 1,
    title: 'My First Human',
    description: 'Puro\'s first attempt at drawing a human. The proportions are a bit off, but it\'s endearing.',
    emotion: 'curious',
  },
  {
    id: 2,
    title: 'The Library',
    description: 'A detailed sketch of the library with all the bookshelves and the bonsai tree.',
    emotion: 'peaceful',
  },
  {
    id: 3,
    title: 'Friendship',
    description: 'A drawing of two figures sitting together, reading. One is clearly Puro, the other is you.',
    emotion: 'happy',
  },
];

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export default function DrawingMiniGame({ onComplete, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewed, setViewed] = useState<Set<number>>(new Set());
  const { adjustTrust } = useGameStore();

  const currentDrawing = drawings[currentIndex];

  const handleView = () => {
    if (!viewed.has(currentDrawing.id)) {
      setViewed(prev => new Set(prev).add(currentDrawing.id));
      adjustTrust(3);
    }
  };

  const handleNext = () => {
    if (currentIndex < drawings.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    if (viewed.size === drawings.length) {
      adjustTrust(5);
      toast.success('Puro is happy you appreciated all his drawings!');
    }
    onComplete();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Puro's Drawings</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">
                  {currentDrawing.emotion === 'curious' && '🤔'}
                  {currentDrawing.emotion === 'peaceful' && '😌'}
                  {currentDrawing.emotion === 'happy' && '😊'}
                </div>
                <p className="text-sm text-muted-foreground italic">
                  [A simple but heartfelt drawing]
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-lg">{currentDrawing.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{currentDrawing.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {drawings.length}
            </span>

            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              disabled={currentIndex === drawings.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={handleView} variant="secondary" className="w-full" disabled={viewed.has(currentDrawing.id)}>
            {viewed.has(currentDrawing.id) ? 'Viewed' : 'Appreciate Drawing'}
          </Button>

          <Button onClick={handleFinish} className="w-full">
            Finish ({viewed.size}/{drawings.length} viewed)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
