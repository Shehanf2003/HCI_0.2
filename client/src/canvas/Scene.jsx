import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { useDesign } from '../context/DesignContext';
import Room from './Room';
import FurnitureItem from './FurnitureItem';
import Lights from './Lights';
import DragDropController from './DragDropController';

const Scene = () => {
  const { room, viewMode, selectedFurnitureId, setSelectedFurnitureId, isPaintMode } = useDesign();

  const handleMissed = () => {
    setSelectedFurnitureId(null);
  };

  return (
    <div
      className={`h-full w-full bg-gray-200 dark:bg-gray-900 transition-colors duration-300 ${isPaintMode ? 'cursor-crosshair' : ''}`}
    >
      <Canvas shadows onPointerMissed={handleMissed} gl={{ preserveDrawingBuffer: true }} id="design-canvas">
        <Suspense fallback={null}>
            {viewMode === '3D' ? (
                <PerspectiveCamera makeDefault position={[0, 1.6, 4]} fov={50} />
            ) : (
                <OrthographicCamera makeDefault position={[0, 20, 0]} zoom={20} />
            )}

            <OrbitControls
                makeDefault
                enableRotate={viewMode === '3D'}
                enableZoom={true}
                enablePan={true}
                maxPolarAngle={viewMode === '3D' ? Math.PI / 2 : 0} 
                target={[0, 1, 0]}
            />

            <Lights />
            <DragDropController />

            <group>
                <Room />
                {room && room.furnitureItems && room.furnitureItems.map((item) => (
                    <FurnitureItem
                        key={item._id || Math.random()} 
                        item={item}
                        isSelected={selectedFurnitureId === item._id}
                        onSelect={setSelectedFurnitureId}
                    />
                ))}
            </group>

            <gridHelper args={[20, 20]} />
            <axesHelper args={[5]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
