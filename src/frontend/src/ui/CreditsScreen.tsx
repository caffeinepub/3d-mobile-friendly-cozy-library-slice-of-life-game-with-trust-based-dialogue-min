import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart } from 'lucide-react';

interface CreditsScreenProps {
  onBack: () => void;
}

export default function CreditsScreen({ onBack }: CreditsScreenProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname || 'cozy-library-game')
    : 'cozy-library-game';

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/assets/generated/menu-library-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <Card className="relative z-10 max-w-2xl w-full bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl">Credits & About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Cozy Library</h3>
            <p className="text-muted-foreground">
              A slice-of-life adventure game about building friendship and finding companionship 
              in a quiet library. Explore, interact, and discover heartwarming moments with Puro.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Game Features</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Trust-based relationship system</li>
              <li>Interactive dialogue and story choices</li>
              <li>Cozy mini-games and activities</li>
              <li>Library customization</li>
              <li>Multiple endings based on your choices</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              © {currentYear} • Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>

          <Button onClick={onBack} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Title
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
