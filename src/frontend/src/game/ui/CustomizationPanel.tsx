import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { customizationItems } from '../customization/customizationData';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomizationPanel() {
  const { discoveredItems, libraryCustomizations, addCustomization, setShowCustomization } = useGameStore();

  const availableItems = customizationItems.filter(
    item => discoveredItems.includes(item.id) && !libraryCustomizations.some(c => c.itemName === item.name)
  );

  const handlePlace = (item: typeof customizationItems[0], location: string) => {
    addCustomization({
      itemName: item.name,
      description: item.description,
      location,
    });
    toast.success(`Placed ${item.name} in the library!`);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Library Customization</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowCustomization(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Discover items in the vents and place them around the library to make it more cozy!
          </p>

          {/* Placed items */}
          {libraryCustomizations.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Placed Items:</h3>
              {libraryCustomizations.map((item, index) => (
                <div key={index} className="bg-muted p-3 rounded-lg">
                  <div className="font-medium">{item.itemName}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">Location: {item.location}</div>
                </div>
              ))}
            </div>
          )}

          {/* Available items */}
          {availableItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Available Items:</h3>
              {availableItems.map(item => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{item.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {item.possibleLocations.map(location => (
                      <Button
                        key={location}
                        onClick={() => handlePlace(item, location)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {availableItems.length === 0 && libraryCustomizations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items discovered yet. Check the vents around the library!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
