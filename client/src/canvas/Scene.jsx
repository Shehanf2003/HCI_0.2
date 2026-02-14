import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { useDesign } from '../context/DesignContext';
import Room from './Room';
import FurnitureItem from './FurnitureItem';
import Lights from './Lights';

const Scene = () => {
  const { room, viewMode, selectedFurnitureId, setSelectedFurnitureId } = useDesign();

  const handleMissed = () => {
    setSelectedFurnitureId(null);
  };

  return (
    <div className="h-full w-full bg-gray-200">
      <Canvas shadows onPointerMissed={handleMissed}>
        <Suspense fallback={null}>
            {viewMode === '3D' ? (
                <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
            ) : (
                <OrthographicCamera makeDefault position={[0, 20, 0]} zoom={20} />
            )}

            <OrbitControls
                enableRotate={viewMode === '3D'}
                enableZoom={true}
                enablePan={true}
                maxPolarAngle={viewMode === '3D' ? Math.PI / 2 : 0} // Prevent going below ground
            />

            <Lights />

            <group>
                <Room />
                {room && room.furnitureItems && room.furnitureItems.map((item) => (
                    <FurnitureItem
                        key={item._id || Math.random()} // Fallback key if no _id
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
