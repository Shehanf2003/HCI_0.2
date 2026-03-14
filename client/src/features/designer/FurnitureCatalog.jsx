import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import axios from 'axios';
import { useDesign } from '../../context/DesignContext';
import Button from '../../components/UI/Button';
import { Canvas } from '@react-three/fiber';
import { Center, Environment, useGLTF, Stage } from '@react-three/drei';
import EditFurnitureModal from '../../components/Admin/EditFurnitureModal';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/confirmToast';
import HoverModelViewer from './HoverModelViewer';

const ModelThumbnail = React.memo(({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border dark:border-gray-500 relative">
        <Canvas
            frameloop="demand" 
            gl={{ preserveDrawingBuffer: true, alpha: true }}
            shadows={false}
            className="w-full h-full"
            style={{ pointerEvents: 'none' }} 
        >
            <Suspense fallback={null}>
                <Stage environment="city" intensity={0.5} contactShadow={false} shadow={false} adjustCamera={true}>
                    <primitive object={clonedScene} />
                </Stage>
            </Suspense>
        </Canvas>
    </div>
  );
});

const FurnitureCatalog = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFurniture, room } = useDesign();
  const [filterType, setFilterType] = useState('All');

  const [editingItem, setEditingItem] = useState(null);
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = userInfo?.isAdmin;

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

  useEffect(() => {
    fetchFurniture();
  }, []);

  const handleDeleteItem = async (itemId) => {
    confirmToast("Are you sure you want to delete this furniture item?", async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/furniture/${itemId}`, config);

        // Refresh the list
        fetchFurniture();
        toast.success('Furniture item deleted successfully.');
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    });
  };

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
  };

  const furnitureTypes = useMemo(() => {
    if (!furnitureItems) return [];
    const types = furnitureItems.map(item => item.type).filter(Boolean);
    return ['All', ...new Set(types)];
  }, [furnitureItems]);

  const filteredItems = useMemo(() => {
    if (filterType === 'All') {
      return furnitureItems;
    }
    return furnitureItems.filter(item => item.type === filterType);
  }, [furnitureItems, filterType]);

  if (loading) return <div className="p-4 text-gray-500 dark:text-gray-400">Loading catalog...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col bg-transparent transition-colors duration-300">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white">Furniture Catalog</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag and drop items into the room</p>
        <div className="mt-4">
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Type</label>
          <select
            id="type-filter"
            name="type-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {furnitureTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="border dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex items-center space-x-3"
            >
                {item.modelUrl ? (
                  <HoverModelViewer modelUrl={item.modelUrl}>
                    <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border dark:border-gray-500 relative cursor-pointer group hover:border-indigo-500 transition-colors">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Suspense fallback={<div className="w-16 h-16 bg-gray-200 animate-pulse rounded"></div>}>
                           <ModelThumbnail modelUrl={item.modelUrl} />
                        </Suspense>
                      )}
                    </div>
                  </HoverModelViewer>
                ) : (
                  item.imageUrl ? (
                    <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border dark:border-gray-500 relative">
                       <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                     <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border dark:border-gray-500 relative">
                        <span className="text-2xl">🪑</span>
                     </div>
                  )
                )}

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">${item.price}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1 text-xs py-1"
                    onClick={() => handleAddItem(item)}
                  >
                    Add
                  </Button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        title="Edit Item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="Delete Item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredItems.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-8">
            {furnitureItems.length === 0 ? 'No furniture available.' : 'No items match the current filter.'}
          </p>
        )}
      </div>

      {editingItem && (
        <EditFurnitureModal
          furnitureItem={editingItem}
          onClose={() => setEditingItem(null)}
          onEditSuccess={() => {
            fetchFurniture();
          }}
        />
      )}
    </div>
  );
};

export default FurnitureCatalog;
