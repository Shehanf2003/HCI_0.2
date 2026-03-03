import React from 'react';
import { useDesign } from '../../context/DesignContext';
import Button from '../../components/UI/Button';

const ToolBar = () => {
  const { viewMode, setViewMode, transformMode, setTransformMode } = useDesign();

  return (
    <div className="bg-gray-100 p-4 border-b flex justify-between items-center dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Design Workspace</span>

        {/* Transform Controls Toggles */}
        {viewMode === '3D' && (
          <div className="flex bg-white dark:bg-gray-700 rounded-md shadow-sm border dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => setTransformMode('translate')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                transformMode === 'translate'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Move
            </button>
            <button
              onClick={() => setTransformMode('rotate')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors border-l dark:border-gray-600 ${
                transformMode === 'rotate'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Rotate
            </button>
          </div>
        )}
      </div>
      <div>
        <Button
          variant="secondary"
          onClick={() => setViewMode(viewMode === '2D' ? '3D' : '2D')}
        >
          Switch to {viewMode === '2D' ? '3D' : '2D'}
        </Button>
      </div>
    </div>
  );
};

export default ToolBar;
