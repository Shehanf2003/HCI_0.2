import React, { useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { useDesign } from '../context/DesignContext';

const FurnitureItem = ({ item, isSelected, onSelect }) => {
  const mesh = useRef();
  const { updateFurniture, room } = useDesign();

  // If item.furnitureId is populated, use its dimensions. Otherwise use defaults.
  const dims = item.furnitureId?.dimensions || { width: 1, height: 1, depth: 1 };

  const handleTransformEnd = () => {
    if (mesh.current) {
        // TransformControls modifies the object's position/rotation/scale directly
        const { position, rotation, scale } = mesh.current;

        updateFurniture(room._id, item._id, {
            position: { x: position.x, y: position.y, z: position.z },
            rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
            scale: { x: scale.x, y: scale.y, z: scale.z },
        });
    }
  };

  const MeshComponent = (
    <mesh
      ref={mesh}
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
      scale={[item.scale.x, item.scale.y, item.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item._id);
      }}
    >
      <boxGeometry args={[dims.width, dims.height, dims.depth]} />
      <meshStandardMaterial color={item.color || '#ffffff'} />
    </mesh>
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
