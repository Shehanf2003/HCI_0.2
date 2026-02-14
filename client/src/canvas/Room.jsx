import React from 'react';
import { useDesign } from '../context/DesignContext';

const Room = () => {
  const { room } = useDesign();

  if (!room) return null;

  const { dimensions, colorScheme } = room;
  const { length, width, height } = dimensions; // length=x, width=z, height=y
  const { floorColor, wallColor } = colorScheme;

  const halfLength = length / 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Back Wall (negative Z) */}
      <mesh position={[0, halfHeight, -halfWidth]}>
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
      <mesh position={[-halfLength, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} side={2} />
      </mesh>

      {/* Right Wall (positive X) */}
      <mesh position={[halfLength, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} side={2} />
      </mesh>
    </group>
  );
};

export default Room;
