import { Circle, Loader2, WifiOff, Wifi } from 'lucide-react';
import type { BackendAvailabilityState } from '../hooks/useBackendAvailability';

interface ServerStatusIndicatorProps {
  serverAccessEnabled: boolean;
  backendAvailability?: BackendAvailabilityState;
}

export default function ServerStatusIndicator({
  serverAccessEnabled,
  backendAvailability,
}: ServerStatusIndicatorProps) {
  // Determine status
  let statusText: string;
  let statusColor: string;
  let StatusIcon: React.ComponentType<{ className?: string }>;

  if (!serverAccessEnabled) {
    statusText = 'Local Offline';
    statusColor = 'text-muted-foreground';
    StatusIcon = WifiOff;
  } else if (backendAvailability?.isChecking) {
    statusText = 'Checking…';
    statusColor = 'text-yellow-600 dark:text-yellow-500';
    StatusIcon = Loader2;
  } else if (backendAvailability?.isHealthy) {
    statusText = 'Online';
    statusColor = 'text-green-600 dark:text-green-500';
    StatusIcon = Wifi;
  } else {
    statusText = 'Offline';
    statusColor = 'text-destructive';
    StatusIcon = WifiOff;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/30 border border-border/50">
      <StatusIcon
        className={`h-3.5 w-3.5 ${statusColor} ${backendAvailability?.isChecking ? 'animate-spin' : ''}`}
      />
      <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
    </div>
  );
}
