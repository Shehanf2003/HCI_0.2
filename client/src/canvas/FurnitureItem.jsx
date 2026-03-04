import React, { useState, useRef, useMemo, useEffect, useLayoutEffect, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
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

const GLTFModel = ({ url, color, realWorldWidthMeters }) => {
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
    if (!clonedScene || !realWorldWidthMeters) return;

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

    // Apply scale so the raw bounding box width matches realWorldWidthMeters
    const scaleFactor = realWorldWidthMeters / size.x;

    clonedScene.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Center the model: align bottom-center of the model to (0,0,0) of the group
    clonedScene.position.x = -center.x * scaleFactor;
    clonedScene.position.z = -center.z * scaleFactor;
    clonedScene.position.y = -box.min.y * scaleFactor;

  }, [clonedScene, realWorldWidthMeters]);

  return <primitive object={clonedScene} />;
};

const FurnitureItem = ({ item, isSelected, onSelect }) => {
  const mesh = useRef();
  const transformRef = useRef();
  const { controls } = useThree();
  const { updateFurniture, room, transformMode } = useDesign();

  // Local state for interactive movements
  const [position, setPosition] = useState([item.position.x, item.position.y, item.position.z]);
  const [rotation, setRotation] = useState([item.rotation.x, item.rotation.y, item.rotation.z]);

  // Sync if item changes from outside
  useEffect(() => {
    setPosition([item.position.x, item.position.y, item.position.z]);
    setRotation([item.rotation.x, item.rotation.y, item.rotation.z]);
  }, [item.position, item.rotation]);

  // item.furnitureId is populated object
  const dims = item.furnitureId?.dimensions || { width: 1, height: 1, depth: 1 };
  const modelUrl = item.furnitureId?.modelUrl;
  const realWorldWidthMeters = item.furnitureId?.realWorldWidthMeters || 1; // Default to 1 if not provided

  useEffect(() => {
    const tControls = transformRef.current;
    if (!tControls) return;

    // Temporarily disable global camera controls when dragging the furniture
    const handleDraggingChanged = (event) => {
      if (controls) {
        controls.enabled = !event.value;
      }
    };

    tControls.addEventListener('dragging-changed', handleDraggingChanged);
    return () => {
      tControls.removeEventListener('dragging-changed', handleDraggingChanged);
      // Ensure controls are re-enabled if component unmounts while dragging
      if (controls) controls.enabled = true;
    };
  }, [controls, isSelected]);

  const roundToDecimals = (val, decimals = 3) => {
    return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
  };

  const handleTransformEnd = () => {
    if (transformRef.current) {
        const { position: newPos, rotation: newRot } = transformRef.current;

        const newPosition = {
          x: roundToDecimals(newPos.x),
          y: roundToDecimals(newPos.y),
          z: roundToDecimals(newPos.z)
        };
        const newRotation = {
          x: roundToDecimals(newRot.x),
          y: roundToDecimals(newRot.y),
          z: roundToDecimals(newRot.z)
        };

        // Update local state for immediate feedback
        setPosition([newPosition.x, newPosition.y, newPosition.z]);
        setRotation([newRotation.x, newRotation.y, newRotation.z]);

        // Sync with backend
        updateFurniture(room._id, item._id, {
            position: newPosition,
            rotation: newRotation,
            scale: item.scale,
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
      position={!isSelected ? position : [0, 0, 0]} // When selected, transform controls handle the position
      rotation={!isSelected ? rotation : [0, 0, 0]} // When selected, transform controls handle the rotation
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
                  realWorldWidthMeters={realWorldWidthMeters}
                />
             </Suspense>
          </ModelErrorBoundary>
        ) : FallbackMesh}
    </group>
  );

  if (isSelected) {
      return (
          <TransformControls
             ref={transformRef}
             mode={transformMode}
             position={position}
             rotation={rotation}
             onMouseUp={handleTransformEnd}
             showY={transformMode === 'translate' ? false : true}
             showX={transformMode === 'rotate' ? false : true}
             showZ={transformMode === 'rotate' ? false : true}
          >
              {MeshComponent}
          </TransformControls>
      );
  }

  return MeshComponent;
};

export default FurnitureItem;
