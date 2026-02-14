import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '../state/useGameStore';
import { generateResponse } from '../letters/letterTemplates';
import { X, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function LettersPanel() {
  const [newLetter, setNewLetter] = useState('');
  const { letters, addLetter, addLetterResponse, setShowLetters } = useGameStore();

  const handleSend = () => {
    if (newLetter.trim().length === 0) {
      toast.error('Please write something first!');
      return;
    }

    if (newLetter.length > 500) {
      toast.error('Letter is too long! Keep it under 500 characters.');
      return;
    }

    addLetter(newLetter);
    
    // Generate response after a short delay
    setTimeout(() => {
      const response = generateResponse(newLetter);
      addLetterResponse(letters.length, response);
      toast.success('You received a response!');
    }, 2000);

    setNewLetter('');
    toast.success('Letter sent through the vent!');
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-2xl w-full max-h-[80vh]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Letters</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowLetters(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="inbox">Inbox ({letters.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Write a letter and send it through the vent. Maybe someone friendly will respond!
              </p>
              <Textarea
                value={newLetter}
                onChange={(e) => setNewLetter(e.target.value)}
                placeholder="Dear friend..."
                className="min-h-[200px]"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {newLetter.length}/500 characters
                </span>
                <Button onClick={handleSend}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Letter
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="inbox">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4 pr-4">
                  {letters.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No letters yet. Write one to get started!
                    </p>
                  ) : (
                    letters.map((letter, index) => (
                      <div key={index} className="space-y-2">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">
                            You wrote:
                          </div>
                          <p className="text-sm">{letter.content}</p>
                        </div>
                        {letter.response && (
                          <div className="bg-primary/10 p-3 rounded-lg ml-4">
                            <div className="text-xs text-muted-foreground mb-1">
                              Response:
                            </div>
                            <p className="text-sm">{letter.response}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
