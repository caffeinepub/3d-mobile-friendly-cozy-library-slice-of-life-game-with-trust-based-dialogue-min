interface DiagnosticsData {
  currentScreen: string;
  startupComplete: boolean;
  lastLaunchAction: string | null;
  launchStage: string;
  gameMounted: boolean;
  errorMessage: string | null;
  userFriendlySummary: string | null;
}

export function formatDiagnostics(diagnostics: DiagnosticsData | null): string[] {
  if (!diagnostics) {
    return ['Diagnostics not available'];
  }

  const lines: string[] = [];
  lines.push('=== Application Diagnostics ===');
  lines.push(`Current Screen: ${diagnostics.currentScreen}`);
  lines.push(`Startup Complete: ${diagnostics.startupComplete ? 'Yes' : 'No'}`);
  
  if (diagnostics.lastLaunchAction) {
    lines.push(`Last Launch Action: ${diagnostics.lastLaunchAction}`);
    lines.push(`Launch Stage: ${diagnostics.launchStage}`);
    lines.push(`Game Mounted: ${diagnostics.gameMounted ? 'Yes' : 'No'}`);
  } else {
    lines.push('Last Launch Action: None');
  }
  
  if (diagnostics.errorMessage) {
    lines.push(`Error: ${diagnostics.errorMessage}`);
  }
  
  if (diagnostics.userFriendlySummary) {
    lines.push(`Summary: ${diagnostics.userFriendlySummary}`);
  }
  
  return lines;
}
