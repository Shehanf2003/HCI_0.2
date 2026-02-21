import React, { useRef, useMemo, useEffect, useLayoutEffect, Suspense } from 'react';
import { TransformControls, useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
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

const GLTFModel = ({ url, color, targetDims }) => {
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

  useLayoutEffect(() => {
    if (!clonedScene || !targetDims) return;

    // Reset transforms to calculate base bounding box
    clonedScene.scale.set(1, 1, 1);
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);

    const box = new Box3().setFromObject(clonedScene);
    const size = new Vector3();
    box.getSize(size);
    const center = new Vector3();
    box.getCenter(center);

    if (size.lengthSq() === 0) return;

    // Calculate scale to fit within target dimensions while maintaining aspect ratio
    // We use the minimum scale factor required for the largest dimension to fit
    // scale = min(target / source) for all axes.
    const scaleX = targetDims.width / size.x;
    const scaleY = targetDims.height / size.y;
    const scaleZ = targetDims.depth / size.z;

    const scaleFactor = Math.min(scaleX, scaleY, scaleZ);

    clonedScene.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Center the model: align bottom-center of the model to (0,0,0) of the group
    // The model center is at `center` (in unscaled local space)
    // To center X and Z: shift by -center.x * scale, -center.z * scale
    // To align bottom Y: shift by -box.min.y * scale

    clonedScene.position.x = -center.x * scaleFactor;
    clonedScene.position.z = -center.z * scaleFactor;
    clonedScene.position.y = -box.min.y * scaleFactor;

  }, [clonedScene, targetDims]);

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
                <GLTFModel
                  url={modelUrl}
                  color={item.color || '#ffffff'}
                  targetDims={dims}
                />
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
