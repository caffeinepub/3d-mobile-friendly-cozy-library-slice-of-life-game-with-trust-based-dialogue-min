import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Unlock, LogOut, AlertCircle } from 'lucide-react';
import { useAdminGateStore } from '../state/useAdminGateStore';

export default function AdminAccessPanel() {
  const { isUnlocked, attemptUnlock, lock } = useAdminGateStore();
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a username' });
      return;
    }

    const success = attemptUnlock(username);
    
    if (success) {
      setFeedback({ type: 'success', message: 'Admin mode unlocked' });
      setUsername('');
    } else {
      setFeedback({ type: 'error', message: 'Invalid username' });
    }
  };

  const handleLock = () => {
    lock();
    setFeedback({ type: 'success', message: 'Admin mode locked' });
    setUsername('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isUnlocked ? (
            <>
              <Unlock className="h-5 w-5 text-green-500" />
              Admin Access
            </>
          ) : (
            <>
              <Lock className="h-5 w-5" />
              Admin Access
            </>
          )}
        </CardTitle>
        <CardDescription>
          Local-only username gate for diagnostic controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This is a local-only gate, not secure authentication. Admin controls are hidden from regular users but can be accessed by anyone who knows the username.
          </AlertDescription>
        </Alert>

        {isUnlocked ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Admin mode is unlocked
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Diagnostic controls are now visible
              </p>
            </div>
            <Button
              onClick={handleLock}
              variant="outline"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Lock Admin Mode
            </Button>
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full">
              <Unlock className="mr-2 h-4 w-4" />
              Unlock Admin Mode
            </Button>
          </form>
        )}

        {feedback && (
          <div
            className={`p-3 rounded-lg text-sm ${
              feedback.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-destructive/10 border border-destructive/20 text-destructive'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
