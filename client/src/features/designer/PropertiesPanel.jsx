import React, { useEffect, useState } from 'react';
import { useDesign } from '../../context/DesignContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const PropertiesPanel = () => {
  const { room, selectedFurnitureId, updateFurniture, removeFurniture } = useDesign();
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

    // Optimistic update locally?
    // Ideally we call updateFurniture which calls API and then updates context
    updateFurniture(room._id, selectedItem._id, updates);
  };

  if (!selectedItem) {
    return (
      <div className="w-64 bg-gray-50 border-l p-4">
        <p className="text-gray-500">Select an item to edit properties</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 border-l p-4 overflow-y-auto h-full">
      <h3 className="font-bold mb-4">Properties</h3>

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
    </div>
  );
};

export default PropertiesPanel;
