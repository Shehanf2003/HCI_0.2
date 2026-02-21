import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { TransformControls, useGLTF } from '@react-three/drei';
import { useDesign } from '../context/DesignContext';

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const GLTFModel = ({ url, color }) => {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = child.material.clone();
        child.material.color.set(color);
      }
    });
  }, [clonedScene, color]);

  return <primitive object={clonedScene} />;
};

const FurnitureItem = ({ item, isSelected, onSelect }) => {
  const mesh = useRef();
  const { updateFurniture, room } = useDesign();

  // item.furnitureId is populated object
  const dims = item.furnitureId?.dimensions || { width: 1, height: 1, depth: 1 };
  const modelUrl = item.furnitureId?.modelUrl;

  const handleTransformEnd = () => {
    if (mesh.current) {
        const { position, rotation, scale } = mesh.current;
        updateFurniture(room._id, item._id, {
            position: { x: position.x, y: position.y, z: position.z },
            rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
            scale: { x: scale.x, y: scale.y, z: scale.z },
        });
    }
  };

  const FallbackMesh = (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[dims.width, dims.height, dims.depth]} />
      <meshStandardMaterial color={item.color || '#ffffff'} />
    </mesh>
  );

  const MeshComponent = (
    <group
      ref={mesh}
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
      scale={[item.scale.x, item.scale.y, item.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item._id);
      }}
    >
        {modelUrl ? (
          <ModelErrorBoundary fallback={FallbackMesh}>
             <Suspense fallback={FallbackMesh}>
                <GLTFModel url={modelUrl} color={item.color || '#ffffff'} />
             </Suspense>
          </ModelErrorBoundary>
        ) : FallbackMesh}
    </group>
  );

  if (isSelected) {
      return (
          <TransformControls mode="translate" onMouseUp={handleTransformEnd}>
              {MeshComponent}
          </TransformControls>
      );
  }

  return MeshComponent;
};

export default FurnitureItem;
