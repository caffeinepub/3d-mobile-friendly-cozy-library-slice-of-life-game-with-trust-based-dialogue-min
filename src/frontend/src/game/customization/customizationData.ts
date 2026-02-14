export interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  possibleLocations: string[];
}

export const customizationItems: CustomizationItem[] = [
  {
    id: 'cushion',
    name: 'Soft Cushion',
    description: 'A comfortable cushion for sitting and reading.',
    possibleLocations: ['corner-left', 'corner-right', 'center'],
  },
  {
    id: 'lamp',
    name: 'Reading Lamp',
    description: 'A warm lamp that provides cozy lighting.',
    possibleLocations: ['shelf-1', 'shelf-2', 'center'],
  },
  {
    id: 'rug',
    name: 'Cozy Rug',
    description: 'A soft rug that makes the floor more comfortable.',
    possibleLocations: ['center'],
  },
  {
    id: 'plant',
    name: 'Small Plant',
    description: 'A little potted plant to brighten up the space.',
    possibleLocations: ['shelf-1', 'shelf-2', 'corner-left', 'corner-right'],
  },
  {
    id: 'blanket',
    name: 'Warm Blanket',
    description: 'A soft blanket for cold evenings.',
    possibleLocations: ['corner-left', 'corner-right', 'center'],
  },
];
