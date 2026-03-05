import React from 'react';
import { useDesign } from '../../context/DesignContext';
import Button from '../../components/UI/Button';

const ToolBar = () => {
  const { viewMode, setViewMode } = useDesign();

  return (
    <div className="bg-gray-100 p-4 border-b flex justify-between items-center dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Design Workspace</span>
        {/* We removed the explicit "Move" and "Rotate" buttons because
            it is now handled intuitively via drag and drop on the object directly
            and the custom rotation handle. */}
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
