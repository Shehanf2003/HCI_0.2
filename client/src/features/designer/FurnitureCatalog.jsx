import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/UI/Button';
import { useDesign } from '../../context/DesignContext';

const FurnitureCatalog = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFurniture, room } = useDesign();

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/furniture', config);
        setFurnitureItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchFurniture();
  }, []);

  const handleAddItem = (item) => {
    if (!room) return;
    const newItem = {
      furnitureId: item._id,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: item.defaultColor,
    };
    addFurniture(room._id, newItem);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("furnitureId", item._id);
    e.dataTransfer.effectAllowed = "copy";
    // Optional: Set drag image
    // const img = new Image();
    // img.src = item.imageUrl || 'placeholder.png';
    // e.dataTransfer.setDragImage(img, 0, 0);
  };

  if (loading) return <div className="p-4 text-gray-500 dark:text-gray-400">Loading catalog...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-colors duration-300">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white">Furniture Catalog</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag and drop items into the room</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {furnitureItems.map((item) => (
            <div
              key={item._id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="border dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex items-center space-x-3"
            >
              {/* Image Preview */}
              <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border dark:border-gray-500">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="text-center">
                      <span className="text-2xl">🪑</span>
                   </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">${item.price}</p>
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full text-xs py-1"
                  onClick={() => handleAddItem(item)}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
        {furnitureItems.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-8">No furniture available.</p>
        )}
      </div>
    </div>
  );
};

export default FurnitureCatalog;
