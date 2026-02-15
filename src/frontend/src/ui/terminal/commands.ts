import { useTerminalStore } from './useTerminalStore';
import { formatDiagnostics } from './useTerminalDiagnostics';
import { useServerAccessStore } from '../../state/useServerAccessStore';

interface DiagnosticsData {
  currentScreen: string;
  startupComplete: boolean;
  lastLaunchAction: string | null;
  launchStage: string;
  gameMounted: boolean;
  errorMessage: string | null;
  userFriendlySummary: string | null;
}

interface CommandContext {
  diagnostics: DiagnosticsData | null;
  checkServerStatus: () => Promise<{ healthy: boolean; error?: string }>;
}

const HELP_TEXT = `
=== Diagnostic Terminal ===
This terminal is for in-app diagnostics only.

Available commands:
  help              Show this help message
  clear             Clear the terminal output
  server status     Check game server availability
  server on         Enable server access (local toggle)
  server off        Disable server access (local toggle)
  diagnostics       Show application diagnostics

Note: Server on/off commands control local app behavior only.
They do not start or stop the backend canister.
`.trim();

export async function executeCommand(
  command: string,
  context: CommandContext
): Promise<void> {
  const { appendOutput } = useTerminalStore.getState();
  const trimmedCommand = command.trim().toLowerCase();

  if (!trimmedCommand) {
    return;
  }

  if (trimmedCommand === 'help') {
    appendOutput(HELP_TEXT, 'output');
    return;
  }

  if (trimmedCommand === 'clear') {
    useTerminalStore.getState().clear();
    return;
  }

  if (trimmedCommand === 'server on') {
    const { enableServerAccess, serverAccessEnabled } = useServerAccessStore.getState();
    if (serverAccessEnabled) {
      appendOutput('Server access is already enabled.', 'output');
    } else {
      enableServerAccess();
      appendOutput('Server access enabled.', 'success');
      appendOutput('Note: This is a local app toggle. It does not start the backend canister.', 'output');
    }
    return;
  }

  if (trimmedCommand === 'server off') {
    const { disableServerAccess, serverAccessEnabled } = useServerAccessStore.getState();
    if (!serverAccessEnabled) {
      appendOutput('Server access is already disabled.', 'output');
    } else {
      disableServerAccess();
      appendOutput('Server access disabled.', 'success');
      appendOutput('Note: This is a local app toggle. It does not stop the backend canister.', 'output');
    }
    return;
  }

  if (trimmedCommand === 'server status' || trimmedCommand === 'status') {
    const { serverAccessEnabled } = useServerAccessStore.getState();
    
    if (!serverAccessEnabled) {
      appendOutput('Server Status: Checks Disabled', 'output');
      appendOutput('Server access is disabled in this app. Availability checks are not performed.', 'output');
      appendOutput('Use "server on" to enable server access.', 'output');
      return;
    }

    appendOutput('Checking server status...', 'output');
    try {
      const result = await context.checkServerStatus();
      if (result.healthy) {
        appendOutput('Server Status: Healthy', 'success');
        appendOutput('The game server is online and responding.', 'output');
      } else {
        appendOutput('Server Status: Unhealthy', 'error');
        if (result.error) {
          appendOutput(`Error: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      appendOutput('Server Status: Error', 'error');
      appendOutput(
        `Failed to check server status: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    }
    return;
  }

  if (trimmedCommand === 'diagnostics' || trimmedCommand === 'diag') {
    if (!context.diagnostics) {
      appendOutput('Diagnostics not available', 'error');
      return;
    }

    const lines = formatDiagnostics(context.diagnostics);
    lines.forEach((line) => appendOutput(line, 'output'));
    return;
  }

  // Unknown command
  appendOutput(`Unknown command: ${command}`, 'error');
  appendOutput('Type "help" for a list of available commands.', 'output');
}
