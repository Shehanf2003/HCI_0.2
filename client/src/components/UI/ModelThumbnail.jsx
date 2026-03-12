import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, useGLTF, Environment } from '@react-three/drei';

const ModelViewer = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);


  const clone = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive object={clone} />
  );
};

const ModelThumbnail = ({ modelUrl }) => {
  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden relative">
      <Canvas
        frameloop="demand" 
        camera={{ position: [2, 2, 2], fov: 50 }}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        shadows={false} 
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
            <Center>
              <ModelViewer modelUrl={modelUrl} />
            </Center>
            <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelThumbnail;
