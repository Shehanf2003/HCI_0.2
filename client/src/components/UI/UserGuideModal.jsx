import React from 'react';
import Button from './Button';

const UserGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Welcome to the Design Workspace!
        </h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg mb-2 text-primary-600 dark:text-primary-400">1. Adding Furniture</h3>
            <p>Click the "Add" button on any item in the Furniture Catalog on the left panel to place it in the center of your room.</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg mb-2 text-primary-600 dark:text-primary-400">2. Selecting & Moving</h3>
            <p>Click on any furniture item in the 3D workspace to select it. Once selected, you can drag the colored arrows (Transform Controls) to move the item across the floor.</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg mb-2 text-primary-600 dark:text-primary-400">3. Editing Properties</h3>
            <p>When an item is selected, its properties (Name, Size, Position, Scale, Color) will appear in the right panel. You can modify these values or remove the item entirely.</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-lg mb-2 text-primary-600 dark:text-primary-400">4. Room Controls</h3>
            <p>Use your mouse to navigate the 3D view: Left-click and drag to rotate the camera, Right-click and drag to pan, and Scroll to zoom in/out. You can also change room dimensions and colors in the right panel when no item is selected.</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={onClose} className="px-8 py-2">
            Got it! Let's start designing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;