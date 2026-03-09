import React, { useMemo } from 'react';
import { useDesign } from '../context/DesignContext';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

const Room = () => {
  const { room } = useDesign();

  if (!room) return null;

  const { dimensions, colorScheme } = room;
  const { length, width, height } = dimensions || { length: 10, width: 10, height: 3 }; // length=x, width=z, height=y
  const { floorColor, wallColor, floorTexture, wallTexture } = colorScheme || { floorColor: '#8d6e63', wallColor: '#e0e0e0', floorTexture: '', wallTexture: '' };

  // Use useLoader directly with an array of URLs.
  // We use useMemo to only pass the URLs that exist to useLoader.
  const urlsToLoad = useMemo(() => {
    const urls = [];
    if (floorTexture) urls.push(floorTexture);
    if (wallTexture) urls.push(wallTexture);
    return urls;
  }, [floorTexture, wallTexture]);

  // Load all required textures. If urlsToLoad is empty, useLoader returns empty array
  // However, useLoader doesn't like empty arrays in some versions, so we conditionally handle it.
  const textures = useLoader(THREE.TextureLoader, urlsToLoad.length > 0 ? urlsToLoad : ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7']); // dummy image if empty

  const loadedFloorTex = useMemo(() => {
    if (!floorTexture) return null;
    const tex = textures[urlsToLoad.indexOf(floorTexture)];
    if (tex) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(length, width);
    }
    return tex;
  }, [floorTexture, textures, urlsToLoad, length, width]);

  const loadedWallTexFrontBack = useMemo(() => {
    if (!wallTexture) return null;
    const tex = textures[urlsToLoad.indexOf(wallTexture)];
    if (tex) {
      const clonedTex = tex.clone();
      clonedTex.wrapS = THREE.RepeatWrapping;
      clonedTex.wrapT = THREE.RepeatWrapping;
      clonedTex.repeat.set(length, height);
      clonedTex.needsUpdate = true;
      return clonedTex;
    }
    return null;
  }, [wallTexture, textures, urlsToLoad, length, height]);

  const loadedWallTexLeftRight = useMemo(() => {
    if (!wallTexture) return null;
    const tex = textures[urlsToLoad.indexOf(wallTexture)];
    if (tex) {
      const clonedTex = tex.clone();
      clonedTex.wrapS = THREE.RepeatWrapping;
      clonedTex.wrapT = THREE.RepeatWrapping;
      clonedTex.repeat.set(width, height);
      clonedTex.needsUpdate = true;
      return clonedTex;
    }
    return null;
  }, [wallTexture, textures, urlsToLoad, width, height]);


  const halfLength = length / 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color={loadedFloorTex ? '#ffffff' : floorColor} map={loadedFloorTex} />
      </mesh>

      {/* Back Wall (negative Z) */}
      <mesh position={[0, halfHeight, -halfWidth]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color={loadedWallTexFrontBack ? '#ffffff' : wallColor} map={loadedWallTexFrontBack} side={2} />
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
        <meshStandardMaterial color={loadedWallTexLeftRight ? '#ffffff' : wallColor} map={loadedWallTexLeftRight} side={2} />
      </mesh>

      {/* Right Wall (positive X) */}
      <mesh position={[halfLength, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={loadedWallTexLeftRight ? '#ffffff' : wallColor} map={loadedWallTexLeftRight} side={2} />
      </mesh>
    </group>
  );
};

export default Room;
