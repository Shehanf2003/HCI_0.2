import React, { useLayoutEffect } from 'react';
import { useDesign } from '../context/DesignContext';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

const TexturedMaterial = ({ url, repeatX, repeatY }) => {
 
  const texture = useLoader(THREE.TextureLoader, url, (loader) => {
    loader.setCrossOrigin('anonymous');
  });

  
  useLayoutEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
      texture.needsUpdate = true;
    }
  }, [texture, repeatX, repeatY]);

  return <meshStandardMaterial map={texture} color="#ffffff" side={THREE.DoubleSide} />;
};


const Room = () => {
  const { room } = useDesign();

  if (!room) return null;

  const { dimensions, colorScheme } = room;
  const { length, width, height } = dimensions || { length: 10, width: 10, height: 3 }; 
  const { floorColor, wallColor, floorTexture, wallTexture } = colorScheme || { 
    floorColor: '#8d6e63', 
    wallColor: '#e0e0e0', 
    floorTexture: '', 
    wallTexture: '' 
  };

  const halfLength = length / 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return (
    <group>
    
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        
        {floorTexture ? (
          <TexturedMaterial url={floorTexture} repeatX={length} repeatY={width} />
        ) : (
          <meshStandardMaterial color={floorColor} />
        )}
      </mesh>

      <mesh position={[0, halfHeight, -halfWidth]} receiveShadow>
        <planeGeometry args={[length, height]} />
        {wallTexture ? (
          <TexturedMaterial url={wallTexture} repeatX={length} repeatY={height} />
        ) : (
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        )}
      </mesh>

      <mesh position={[-halfLength, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        {wallTexture ? (
          <TexturedMaterial url={wallTexture} repeatX={length} repeatY={height} />
        ) : (
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        )}
      </mesh>

      
      <mesh position={[halfLength, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        {wallTexture ? (
          <TexturedMaterial url={wallTexture} repeatX={length} repeatY={height} />
        ) : (
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        )}
      </mesh>
    </group>
  );
};

export default Room;