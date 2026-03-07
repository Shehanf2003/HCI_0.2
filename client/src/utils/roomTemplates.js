export const ROOM_TEMPLATES = [
  {
    id: 'empty',
    name: 'Empty Room',
    dimensions: { length: 10, width: 10, height: 3 },
    colorScheme: { wallColor: '#e0e0e0', floorColor: '#8d6e63' }
  },
  {
    id: 'small_bedroom',
    name: 'Small Bedroom',
    dimensions: { length: 4, width: 4, height: 2.8 },
    colorScheme: { wallColor: '#f5f5dc', floorColor: '#deb887' } // Beige walls, wooden floor color
  },
  {
    id: 'large_living_room',
    name: 'Large Living Room',
    dimensions: { length: 8, width: 6, height: 3.5 },
    colorScheme: { wallColor: '#ffffff', floorColor: '#808080' } // White walls, grey floor
  },
  {
    id: 'office',
    name: 'Office space',
    dimensions: { length: 5, width: 4, height: 3 },
    colorScheme: { wallColor: '#e6f2ff', floorColor: '#696969' } // Light blue walls, dark grey floor
  },
  {
    id: 'studio_apartment',
    name: 'Studio Apartment',
    dimensions: { length: 7, width: 5, height: 3 },
    colorScheme: { wallColor: '#f0f8ff', floorColor: '#d2b48c' } // Alice blue walls, tan floor
  },
  {
    id: 'dining_hall',
    name: 'Dining Hall',
    dimensions: { length: 9, width: 5, height: 3.2 },
    colorScheme: { wallColor: '#fffafa', floorColor: '#8b4513' } // Snow walls, saddle brown floor
  },
  {
    id: 'hallway',
    name: 'Long Hallway',
    dimensions: { length: 15, width: 2, height: 2.5 },
    colorScheme: { wallColor: '#fdf5e6', floorColor: '#556b2f' } // Old lace walls, dark olive green floor
  }
];
