interface CommandContext {
  diagnostics: any;
  checkServerStatus: () => Promise<{ healthy: boolean; error?: string }>;
}

export async function executeCommand(
  input: string,
  context: CommandContext
): Promise<Array<{ text: string; type: 'output' | 'error' }>> {
  const parts = input.trim().toLowerCase().split(/\s+/);
  const command = parts[0];

  // Allowlist of safe commands
  const allowedCommands = ['help', 'clear', 'status', 'server'];

  if (!allowedCommands.includes(command)) {
    return [
      {
        text: `Unknown command: ${command}. Type 'help' for available commands.`,
        type: 'error',
      },
    ];
  }

  switch (command) {
    case 'help':
      return [
        { text: 'Available commands:', type: 'output' },
        { text: '  help           - Show this help message', type: 'output' },
        { text: '  clear          - Clear terminal output', type: 'output' },
        { text: '  status         - Show application diagnostics', type: 'output' },
        { text: '  server status  - Check backend server availability', type: 'output' },
      ];

    case 'clear':
      return [{ text: 'Terminal cleared', type: 'output' }];

    case 'status':
      return formatDiagnostics(context.diagnostics);

    case 'server':
      if (parts[1] === 'status') {
        return await checkServerStatus(context.checkServerStatus);
      }
      return [
        {
          text: `Unknown server subcommand: ${parts[1] || '(none)'}. Try 'server status'.`,
          type: 'error',
        },
      ];

    default:
      return [
        {
          text: `Command not implemented: ${command}`,
          type: 'error',
        },
      ];
  }
}

function formatDiagnostics(diagnostics: any): Array<{ text: string; type: 'output' }> {
  const lines: Array<{ text: string; type: 'output' }> = [];

  lines.push({ text: '=== Application Diagnostics ===', type: 'output' });
  lines.push({ text: `Current Screen: ${diagnostics.currentScreen}`, type: 'output' });
  lines.push({ text: `Startup Complete: ${diagnostics.startupComplete ? 'Yes' : 'No'}`, type: 'output' });

  if (diagnostics.lastLaunchAction) {
    lines.push({ text: `Last Launch Action: ${diagnostics.lastLaunchAction}`, type: 'output' });
    lines.push({ text: `Launch Stage: ${diagnostics.launchStage}`, type: 'output' });
    lines.push({ text: `Game Mounted: ${diagnostics.gameMounted ? 'Yes' : 'No'}`, type: 'output' });
  }

  if (diagnostics.errorMessage) {
    lines.push({ text: `Error: ${diagnostics.errorMessage}`, type: 'output' });
  }

  if (diagnostics.userFriendlySummary) {
    lines.push({ text: `Summary: ${diagnostics.userFriendlySummary}`, type: 'output' });
  }

  return lines;
}

async function checkServerStatus(
  checkFn: () => Promise<{ healthy: boolean; error?: string }>
): Promise<Array<{ text: string; type: 'output' | 'error' }>> {
  const lines: Array<{ text: string; type: 'output' | 'error' }> = [];

  lines.push({ text: 'Checking backend server status...', type: 'output' });

  try {
    const result = await checkFn();

    if (result.healthy) {
      lines.push({ text: 'Server Status: Online', type: 'output' });
      lines.push({ text: 'Backend canister is responding normally.', type: 'output' });
    } else {
      lines.push({ text: 'Server Status: Offline', type: 'output' });
      if (result.error) {
        lines.push({ text: `Error: ${result.error}`, type: 'error' });
      }
      lines.push({
        text: 'The backend canister may be stopped, out of cycles, or experiencing network issues.',
        type: 'output',
      });
    }
  } catch (error) {
    lines.push({ text: 'Server Status: Error', type: 'output' });
    lines.push({
      text: `Failed to check server status: ${error instanceof Error ? error.message : String(error)}`,
      type: 'error',
    });
  }

  return lines;
}
