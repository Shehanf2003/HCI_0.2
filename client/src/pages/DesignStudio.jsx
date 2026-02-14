import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DesignProvider, useDesign } from '../context/DesignContext';
import Navbar from '../components/Layout/Navbar';
import ToolBar from '../features/designer/ToolBar';
import PropertiesPanel from '../features/designer/PropertiesPanel';
import Scene from '../canvas/Scene';

const DesignStudioContent = () => {
  const { id } = useParams();
  const { loadDesign, loading, error, room } = useDesign();

  useEffect(() => {
    if (id) {
      loadDesign(id);
    }
  }, [id]);

  if (loading) return <div className="p-4">Loading design...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!room) return <div className="p-4">Design not found</div>;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col relative">
          <ToolBar />
          <div className="flex-1 bg-gray-200 relative">
            <Scene />
          </div>
        </div>

        {/* Sidebar Properties */}
        <PropertiesPanel />
      </div>
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
