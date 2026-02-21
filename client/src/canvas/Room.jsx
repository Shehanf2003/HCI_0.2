import React from 'react';
import { useDesign } from '../context/DesignContext';

const Room = () => {
  const { room } = useDesign();

  if (!room) return null;

  const { dimensions, colorScheme } = room;
  const { length, width, height } = dimensions || { length: 10, width: 10, height: 3 }; // length=x, width=z, height=y
  const { floorColor, wallColor } = colorScheme || { floorColor: '#8d6e63', wallColor: '#e0e0e0' };

  const halfLength = length / 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Back Wall (negative Z) */}
      <mesh position={[0, halfHeight, -halfWidth]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color={wallColor} side={2} />
      </mesh>

      {/* Front Wall (positive Z) - Optional, might block view */}
      {/*
      <mesh position={[0, halfHeight, halfWidth]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      */}

      {/* Left Wall (negative X) */}
      <mesh position={[-halfLength, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} side={2} />
      </mesh>

      {/* Right Wall (positive X) */}
      <mesh position={[halfLength, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} side={2} />
      </mesh>
    </group>
  );
};

export default Room;
