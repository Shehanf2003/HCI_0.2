import React, { useState } from 'react';
import { useDesign } from '../../context/DesignContext';
import Button from '../../components/UI/Button';
import Modal from '../../components/Feedback/Modal';
import FurnitureCatalog from './FurnitureCatalog';

const ToolBar = () => {
  const { viewMode, setViewMode } = useDesign();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-100 p-4 border-b flex justify-between items-center dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
        <div className="space-x-2">
          <Button onClick={() => setIsCatalogOpen(true)}>Add Furniture</Button>
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

      <Modal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        title="Furniture Catalog"
      >
        <FurnitureCatalog onClose={() => setIsCatalogOpen(false)} />
      </Modal>
    </>
  );
};

export default ToolBar;
