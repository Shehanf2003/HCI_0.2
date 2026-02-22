import React, { useEffect, useState } from 'react';
import { useDesign } from '../../context/DesignContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const PropertiesPanel = () => {
  const { room, selectedFurnitureId, setSelectedFurnitureId, updateFurniture, removeFurniture, updateRoomSpecs } = useDesign();
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (room && room.furnitureItems && selectedFurnitureId) {
      const item = room.furnitureItems.find(i => i._id === selectedFurnitureId);
      setSelectedItem(item || null);
    } else {
      setSelectedItem(null);
    }
  }, [room, selectedFurnitureId]);

  const handleChange = (field, value, subfield = null) => {
    if (!selectedItem) return;

    let updates = {};
    if (subfield) {
      updates = {
        [field]: {
          ...selectedItem[field],
          [subfield]: parseFloat(value)
        }
      };
    } else {
      updates = { [field]: value };
    }

    updateFurniture(room._id, selectedItem._id, updates);
  };

  const handleRoomChange = (field, value, subfield = null) => {
    if (!room) return;

    let updates = {};
    if (field === 'dimensions') {
         updates = {
             dimensions: {
                 ...room.dimensions,
                 [subfield]: parseFloat(value)
             }
         };
    } else if (field === 'colorScheme') {
         updates = {
             colorScheme: {
                 ...room.colorScheme,
                 [subfield]: value
             }
         };
    }
    updateRoomSpecs(room._id, updates);
  };

  if (!selectedItem) {
    if (!room) return <div className="w-full bg-gray-50 border-l p-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300">Loading...</div>;

    return (
      <div className="w-full bg-gray-50 border-l p-4 overflow-y-auto h-full dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300">
        <h3 className="font-bold mb-4">Room Properties</h3>

        <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Dimensions (m)</h4>
            <div className="grid grid-cols-1 gap-2">
                <Input
                    id="room-length"
                    label="Length (x)"
                    type="number"
                    value={room.dimensions.length}
                    onChange={(e) => handleRoomChange('dimensions', e.target.value, 'length')}
                />
                 <Input
                    id="room-width"
                    label="Width (z)"
                    type="number"
                    value={room.dimensions.width}
                    onChange={(e) => handleRoomChange('dimensions', e.target.value, 'width')}
                />
                 <Input
                    id="room-height"
                    label="Height (y)"
                    type="number"
                    value={room.dimensions.height}
                    onChange={(e) => handleRoomChange('dimensions', e.target.value, 'height')}
                />
            </div>
        </div>

        <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Colors</h4>
            <Input
                id="room-wall-color"
                label="Wall Color"
                type="color"
                value={room.colorScheme?.wallColor || '#e0e0e0'}
                onChange={(e) => handleRoomChange('colorScheme', e.target.value, 'wallColor')}
            />
             <Input
                id="room-floor-color"
                label="Floor Color"
                type="color"
                value={room.colorScheme?.floorColor || '#8d6e63'}
                onChange={(e) => handleRoomChange('colorScheme', e.target.value, 'floorColor')}
            />
        </div>

        <div className="mt-8 pt-4 border-t text-sm text-gray-500 dark:text-gray-400 dark:border-gray-700">
            <p>Select a furniture item to edit its properties.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 border-l p-4 overflow-y-auto h-full dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300">
      <h3 className="font-bold mb-4">Item Properties</h3>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Position</h4>
        <div className="grid grid-cols-3 gap-2">
          <Input
            label="X"
            type="number"
            value={selectedItem.position.x}
            onChange={(e) => handleChange('position', e.target.value, 'x')}
          />
          <Input
            label="Y"
            type="number"
            value={selectedItem.position.y}
            onChange={(e) => handleChange('position', e.target.value, 'y')}
          />
          <Input
            label="Z"
            type="number"
            value={selectedItem.position.z}
            onChange={(e) => handleChange('position', e.target.value, 'z')}
          />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Scale</h4>
        <div className="grid grid-cols-3 gap-2">
          <Input
            label="X"
            type="number"
            step="0.1"
            value={selectedItem.scale.x}
            onChange={(e) => handleChange('scale', e.target.value, 'x')}
          />
          <Input
            label="Y"
            type="number"
            step="0.1"
            value={selectedItem.scale.y}
            onChange={(e) => handleChange('scale', e.target.value, 'y')}
          />
          <Input
            label="Z"
            type="number"
            step="0.1"
            value={selectedItem.scale.z}
            onChange={(e) => handleChange('scale', e.target.value, 'z')}
          />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Color</h4>
        <Input
            type="color"
            value={selectedItem.color || '#ffffff'}
            onChange={(e) => handleChange('color', e.target.value)}
        />
      </div>

      <Button variant="danger" onClick={() => removeFurniture(room._id, selectedItem._id)}>
        Remove Item
      </Button>

      <div className="mt-4 pt-4 border-t text-sm text-center dark:border-gray-700">
          <Button variant="secondary" onClick={() => setSelectedFurnitureId(null)}>
              Deselect Item
          </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
