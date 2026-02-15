import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTerminalStore } from './terminal/useTerminalStore';
import { executeCommand } from './terminal/commands';
import { useAdminGateStore } from '../state/useAdminGateStore';

interface DiagnosticTerminalOverlayProps {
  diagnostics: any;
  checkServerStatus: () => Promise<{ healthy: boolean; error?: string }>;
}

export default function DiagnosticTerminalOverlay({
  diagnostics,
  checkServerStatus,
}: DiagnosticTerminalOverlayProps) {
  const { isOpen, outputLines, appendInput, appendOutput, clear, close } = useTerminalStore();
  const { isUnlocked: isAdminUnlocked } = useAdminGateStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut to open terminal (Ctrl+` or Cmd+`) - only when admin unlocked
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        if (isAdminUnlocked && !isOpen) {
          useTerminalStore.getState().open();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAdminUnlocked]);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current?.value.trim();
    if (!input) return;

    appendInput(input);

    const result = await executeCommand(input, {
      diagnostics,
      checkServerStatus,
    });

    result.forEach((line) => appendOutput(line.text, line.type === 'error' ? 'error' : 'output'));

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
      onKeyDown={(e) => {
        // Prevent game controls from triggering
        e.stopPropagation();
      }}
    >
      <div
        className="w-full max-w-4xl h-[80vh] bg-background border-2 border-primary/30 rounded-lg flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-mono font-semibold text-primary">Diagnostic Terminal</h2>
          <Button variant="ghost" size="icon" onClick={close}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Output Area */}
        <ScrollArea className="flex-1 p-4">
          <div ref={scrollRef} className="space-y-1 font-mono text-sm">
            {outputLines.length === 0 && (
              <div className="text-muted-foreground">
                Type 'help' for available commands
              </div>
            )}
            {outputLines.map((line) => (
              <div
                key={line.id}
                className={
                  line.type === 'input'
                    ? 'text-primary font-semibold'
                    : line.type === 'error'
                      ? 'text-destructive'
                      : 'text-foreground'
                }
              >
                {line.text}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <span className="text-primary font-mono self-center">{'>'}</span>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter command..."
              className="flex-1 font-mono"
              autoComplete="off"
              onKeyDown={(e) => {
                // Prevent event bubbling to game controls
                e.stopPropagation();
              }}
            />
            <Button type="submit" variant="outline">
              Execute
            </Button>
            <Button type="button" variant="ghost" onClick={clear}>
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
