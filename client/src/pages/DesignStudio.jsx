import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DesignProvider, useDesign } from '../context/DesignContext';
import ToolBar from '../features/designer/ToolBar';
import PropertiesPanel from '../features/designer/PropertiesPanel';
import FurnitureCatalog from '../features/designer/FurnitureCatalog';
import Scene from '../canvas/Scene';
import UserGuideModal from '../components/UI/UserGuideModal';
import LoadingScreen from '../components/UI/LoadingScreen';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DesignStudioContent = () => {
  const { id } = useParams();
  const { loadDesign, loading, error, room } = useDesign();
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = userInfo?.isAdmin;
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isWorkspaceReady, setIsWorkspaceReady] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (id) {
      loadDesign(id);
    }
  }, [id]);

  useEffect(() => {
    if (room && !loading) {
      const timer = setTimeout(() => {
        setIsWorkspaceReady(true);
        const hasSeenGuide = localStorage.getItem('hasSeenGuide');
        if (!hasSeenGuide) {
          setShowGuide(true);
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [room, loading]);

  const handleCloseGuide = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setShowGuide(false);
  };

  if (error) return <div className="p-4 pt-20 text-red-500 dark:bg-gray-900 min-h-screen">Error: {error}</div>;
  if (!room && !loading) return <div className="p-4 pt-20 dark:text-white dark:bg-gray-900 min-h-screen">Design not found</div>;

  return (
    <>
      {(!isWorkspaceReady || loading) && <LoadingScreen />}
      <UserGuideModal isOpen={showGuide} onClose={handleCloseGuide} />
    <div className="flex flex-col h-screen pt-20 transition-colors duration-300 overflow-hidden relative z-0">
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      />
      <div className="fixed inset-0 z-[-1] bg-gray-100/40 dark:bg-gray-900/40" />

      <div className="flex flex-1 overflow-hidden relative z-10">

        <div
          className={`transition-all duration-300 ease-in-out ${isCatalogOpen ? 'w-72' : 'w-0'} bg-white/40 dark:bg-gray-800/40 border-r dark:border-gray-700 flex flex-col z-20 overflow-hidden relative`}
        >
          <div className="w-72 h-full overflow-hidden flex flex-col">
             <div className="flex-1 overflow-y-auto">
                 <FurnitureCatalog />
             </div>
          </div>
        </div>

        <button
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className="absolute top-1/2 transform -translate-y-1/2 z-30 bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-200 p-1.5 rounded-r-md shadow-md border border-l-0 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-800/80 focus:outline-none transition-all duration-300"
            style={{ left: isCatalogOpen ? '18rem' : '0' }}
            title={isCatalogOpen ? "Minimize Catalog" : "Show Catalog"}
        >
            {isCatalogOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="flex-1 flex flex-col relative min-w-0 z-0">
          <ToolBar />
          <div className="flex-1 bg-transparent relative transition-colors duration-300">
            <Scene />
          </div>
        </div>

        <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className="absolute top-1/2 transform -translate-y-1/2 z-30 bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-200 p-1.5 rounded-l-md shadow-md border border-r-0 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-800/80 focus:outline-none transition-all duration-300"
            style={{ right: isPropertiesOpen ? '18rem' : '0' }}
             title={isPropertiesOpen ? "Minimize Properties" : "Show Properties"}
        >
            {isPropertiesOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div
          className={`transition-all duration-300 ease-in-out ${isPropertiesOpen ? 'w-72' : 'w-0'} bg-white/40 dark:bg-gray-800/40 border-l dark:border-gray-700 flex flex-col z-20 overflow-hidden`}
        >
           <div className="w-72 h-full overflow-hidden">
              <PropertiesPanel />
           </div>
        </div>

      </div>
    </div>
    </>
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
