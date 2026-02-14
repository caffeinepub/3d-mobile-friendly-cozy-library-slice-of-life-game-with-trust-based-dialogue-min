import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameStore } from '../state/useGameStore';
import { dialogueTree } from '../dialogue/dialogueData';
import { X } from 'lucide-react';

export default function DialoguePanel() {
  const { trustLevel, currentDialogueNode, setCurrentDialogueNode, adjustTrust, setShowDialogue } = useGameStore();
  const [currentNode, setCurrentNode] = useState(dialogueTree[0]);

  useEffect(() => {
    const nodeId = currentDialogueNode ?? 0;
    const node = dialogueTree.find(n => n.id === nodeId) || dialogueTree[0];
    setCurrentNode(node);
  }, [currentDialogueNode]);

  const handleChoice = (choice: typeof currentNode.choices[0]) => {
    adjustTrust(choice.trustEffect);
    
    if (choice.nextNode !== null) {
      setCurrentDialogueNode(choice.nextNode);
    } else {
      setShowDialogue(false);
      setCurrentDialogueNode(null);
    }
  };

  const handleClose = () => {
    setShowDialogue(false);
    setCurrentDialogueNode(null);
  };

  // Filter choices based on trust level
  const availableChoices = currentNode.choices.filter(
    choice => !choice.trustRequirement || trustLevel >= choice.trustRequirement
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-2xl w-full max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Puro</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1">
            <p className="text-lg mb-4">{currentNode.text}</p>
          </ScrollArea>
          
          <div className="space-y-2">
            {availableChoices.map((choice) => (
              <Button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4"
              >
                <span className="flex-1">{choice.text}</span>
                {choice.trustEffect !== 0 && (
                  <span className={`text-xs ml-2 ${choice.trustEffect > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {choice.trustEffect > 0 ? '+' : ''}{choice.trustEffect}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
