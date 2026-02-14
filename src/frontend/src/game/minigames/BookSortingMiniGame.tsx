import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Book {
  id: number;
  title: string;
  category: string;
}

const books: Book[] = [
  { id: 1, title: 'The Art of War', category: 'History' },
  { id: 2, title: 'Pride and Prejudice', category: 'Fiction' },
  { id: 3, title: 'A Brief History of Time', category: 'Science' },
  { id: 4, title: '1984', category: 'Fiction' },
  { id: 5, title: 'The Origin of Species', category: 'Science' },
  { id: 6, title: 'The Odyssey', category: 'History' },
];

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export default function BookSortingMiniGame({ onComplete, onClose }: Props) {
  const [shuffledBooks, setShuffledBooks] = useState<Book[]>([]);
  const [sorted, setSorted] = useState<Record<string, Book[]>>({
    History: [],
    Fiction: [],
    Science: [],
  });
  const [isComplete, setIsComplete] = useState(false);
  const { adjustTrust } = useGameStore();

  useEffect(() => {
    setShuffledBooks([...books].sort(() => Math.random() - 0.5));
  }, []);

  const handleDrop = (book: Book, category: string) => {
    if (book.category === category) {
      setSorted(prev => ({
        ...prev,
        [category]: [...prev[category], book],
      }));
      setShuffledBooks(prev => prev.filter(b => b.id !== book.id));
      
      // Check if complete
      if (shuffledBooks.length === 1) {
        setIsComplete(true);
        adjustTrust(8);
        toast.success('Perfect! You helped Puro organize all the books!');
      }
    } else {
      toast.error('That book doesn\'t belong in this category!');
      adjustTrust(-2);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Book Sorting</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Help Puro sort the books into their correct categories!
          </p>

          {/* Unsorted books */}
          {shuffledBooks.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Books to Sort:</h3>
              <div className="flex flex-wrap gap-2">
                {shuffledBooks.map(book => (
                  <div key={book.id} className="bg-muted p-2 rounded text-sm">
                    {book.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(sorted).map(category => (
              <div key={category} className="border-2 border-dashed rounded-lg p-4 min-h-[150px]">
                <h3 className="font-semibold mb-2">{category}</h3>
                <div className="space-y-2">
                  {sorted[category].map(book => (
                    <div key={book.id} className="bg-primary/20 p-2 rounded text-sm flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {book.title}
                    </div>
                  ))}
                </div>
                {shuffledBooks.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {shuffledBooks.map(book => (
                      <Button
                        key={book.id}
                        onClick={() => handleDrop(book, category)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        Place "{book.title}" here
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isComplete && (
            <Button onClick={handleFinish} className="w-full">
              Finish
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
