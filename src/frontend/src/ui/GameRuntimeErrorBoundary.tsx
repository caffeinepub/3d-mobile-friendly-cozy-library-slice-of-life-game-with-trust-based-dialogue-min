import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  onBackToTitle: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

export default class GameRuntimeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game runtime error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const sanitizedMessage = this.state.error?.message || 'Unknown error';
      const stackLines = this.state.error?.stack?.split('\n').slice(0, 5) || [];

      return (
        <div className="w-full h-full flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle className="text-xl">Game Error</CardTitle>
                  <CardDescription className="mt-1">
                    The game encountered an unexpected error during rendering
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Something went wrong while the game was running. You can return to the title screen and try again.
              </p>

              <button
                onClick={this.toggleDetails}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {this.state.showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {this.state.showDetails ? 'Hide' : 'Show'} technical details
              </button>

              {this.state.showDetails && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-xs font-mono max-h-48 overflow-y-auto">
                  <div className="font-semibold">Error: {sanitizedMessage}</div>
                  {stackLines.length > 0 && (
                    <div className="space-y-1 text-muted-foreground">
                      {stackLines.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={this.props.onBackToTitle} className="w-full" size="lg">
                Back to Title
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
