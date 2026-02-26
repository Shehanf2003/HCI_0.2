import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DesignProvider, useDesign } from '../context/DesignContext';
import ToolBar from '../features/designer/ToolBar';
import PropertiesPanel from '../features/designer/PropertiesPanel';
import FurnitureCatalog from '../features/designer/FurnitureCatalog';
import Scene from '../canvas/Scene';
import UploadFurnitureModal from '../components/Admin/UploadFurnitureModal';

const DesignStudioContent = () => {
  const { id } = useParams();
  const { loadDesign, loading, error, room } = useDesign();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = userInfo?.isAdmin;
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);

  useEffect(() => {
    if (id) {
      loadDesign(id);
    }
  }, [id]);

  if (loading) return <div className="p-4 pt-20 dark:text-white dark:bg-gray-900 min-h-screen">Loading design...</div>;
  if (error) return <div className="p-4 pt-20 text-red-500 dark:bg-gray-900 min-h-screen">Error: {error}</div>;
  if (!room) return <div className="p-4 pt-20 dark:text-white dark:bg-gray-900 min-h-screen">Design not found</div>;

  return (
    <div className="flex flex-col h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Sidebar: Furniture Catalog */}
        <div
          className={`transition-all duration-300 ease-in-out ${isCatalogOpen ? 'w-72' : 'w-0'} bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col z-20 overflow-hidden relative`}
        >
          <div className="w-72 h-full overflow-hidden flex flex-col">
             <div className="flex-1 overflow-y-auto">
                 <FurnitureCatalog />
             </div>
             {isAdmin && (
                <div className="p-2 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Upload Furniture
                  </button>
                </div>
             )}
          </div>
        </div>

        {/* Catalog Toggle Button */}
        <button
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className="absolute top-1/2 transform -translate-y-1/2 z-30 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 p-1.5 rounded-r-md shadow-md border border-l-0 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300"
            style={{ left: isCatalogOpen ? '18rem' : '0' }}
            title={isCatalogOpen ? "Minimize Catalog" : "Show Catalog"}
        >
            {isCatalogOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </button>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col relative min-w-0 z-0">
          <ToolBar />
          <div className="flex-1 bg-gray-200 dark:bg-gray-900 relative transition-colors duration-300">
            <Scene />
          </div>
        </div>

        {/* Properties Toggle Button */}
        <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className="absolute top-1/2 transform -translate-y-1/2 z-30 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 p-1.5 rounded-l-md shadow-md border border-r-0 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300"
            style={{ right: isPropertiesOpen ? '18rem' : '0' }}
             title={isPropertiesOpen ? "Minimize Properties" : "Show Properties"}
        >
            {isPropertiesOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            )}
        </button>

        {/* Right Sidebar: Properties Panel */}
        <div
          className={`transition-all duration-300 ease-in-out ${isPropertiesOpen ? 'w-72' : 'w-0'} bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col z-20 overflow-hidden`}
        >
           <div className="w-72 h-full overflow-hidden">
              <PropertiesPanel />
           </div>
        </div>

      </div>

      {showUploadModal && (
        <UploadFurnitureModal
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={() => {
                // Optionally reload catalog or show success message
                // The current catalog fetches on mount, so we might need a way to refresh it
                // For now, simpler is acceptable.
                alert('Furniture uploaded successfully!');
                window.location.reload(); // Simple refresh to show new item
            }}
        />
      )}
    </div>
  );
};

const DesignStudio = () => {
  return (
    <DesignProvider>
      <DesignStudioContent />
    </DesignProvider>
  );
};

export default DesignStudio;
