import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTerminalStore } from './terminal/useTerminalStore';
import { useAdminGateStore } from '../state/useAdminGateStore';
import { executeCommand } from './terminal/commands';

interface DiagnosticsData {
  currentScreen: string;
  startupComplete: boolean;
  lastLaunchAction: string | null;
  launchStage: string;
  gameMounted: boolean;
  errorMessage: string | null;
  userFriendlySummary: string | null;
}

interface DiagnosticTerminalOverlayProps {
  diagnostics: DiagnosticsData;
  checkServerStatus: () => Promise<{ healthy: boolean; error?: string }>;
}

export default function DiagnosticTerminalOverlay({
  diagnostics,
  checkServerStatus,
}: DiagnosticTerminalOverlayProps) {
  const { isOpen, outputLines, appendInput, close } = useTerminalStore();
  const { isUnlocked: isAdminUnlocked } = useAdminGateStore();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Handle keyboard shortcuts - only allow opening when admin unlocked
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+` or Cmd+` to toggle terminal - only when admin unlocked
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        if (isOpen) {
          close();
        } else if (isAdminUnlocked) {
          useTerminalStore.getState().open();
        }
      }
      // Escape to close terminal
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAdminUnlocked, close]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    appendInput(inputValue);
    setInputValue('');

    await executeCommand(inputValue, {
      diagnostics,
      checkServerStatus,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex flex-col"
      onClick={(e) => {
        // Prevent clicks from propagating to game
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        // Prevent keyboard events from propagating to game
        e.stopPropagation();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="font-mono text-sm text-foreground">Diagnostic Terminal</span>
          <span className="text-xs text-muted-foreground">
            (Ctrl+` or Esc to close)
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={close}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Output Area */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="font-mono text-sm space-y-1">
          {outputLines.length === 0 && (
            <div className="text-muted-foreground">
              Type "help" for available commands.
            </div>
          )}
          {outputLines.map((line) => (
            <div
              key={line.id}
              className={
                line.type === 'input'
                  ? 'text-blue-400'
                  : line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'success'
                      ? 'text-green-400'
                      : 'text-foreground'
              }
            >
              {line.text}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background/50">
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono">{'>'}</span>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 font-mono bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter command..."
            autoComplete="off"
          />
        </div>
      </form>
    </div>
  );
}
