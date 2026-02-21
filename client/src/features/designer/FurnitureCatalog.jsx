import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/UI/Button';
import { useDesign } from '../../context/DesignContext';

const FurnitureCatalog = ({ onClose }) => {
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
    const newItem = {
      furnitureId: item._id,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: item.defaultColor,
    };
    addFurniture(room._id, newItem);
    onClose(); // Close catalog after adding
  };

  if (loading) return <div className="p-4">Loading catalog...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {furnitureItems.map((item) => (
          <div key={item._id} className="border rounded p-3 bg-white shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 mb-2 flex items-center justify-center rounded">
              {/* Placeholder for image */}
              <span className="text-xs text-gray-500">{item.type}</span>
            </div>
            <h4 className="font-medium text-sm mb-1">{item.name}</h4>
            <p className="text-xs text-gray-500 mb-2">${item.price}</p>
            <Button className="py-1 px-3 text-sm" onClick={() => handleAddItem(item)}>
              Add
            </Button>
          </div>
        ))}
      </div>
      {furnitureItems.length === 0 && (
        <p className="text-gray-500 text-center">No furniture available.</p>
      )}
    </div>
  );
};

export default FurnitureCatalog;
