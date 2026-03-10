import React, { useState, useRef, useMemo, useEffect, useLayoutEffect, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3, Plane, Raycaster, Matrix4, Color } from 'three';
import { useDrag } from '@use-gesture/react';
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

const GLTFModel = ({ url, customColors, realWorldWidthMeters, onMeshClick }) => {
  const { scene } = useGLTF(url);

  // Deep clone the scene and its materials so each instance can have distinct colors
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material = child.material.clone();
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // If there's a custom color for this mesh, apply it.
        // Convert to a Three.js Color object to use ColorManagement automatically.
        if (customColors && customColors[child.name] && child.material) {
          child.material.color = new Color(customColors[child.name]);
        }
      }
    });
  }, [clonedScene, customColors]);

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

  return (
    <primitive
      object={clonedScene}
      onClick={(e) => {
        if (!e.intersections || e.intersections.length === 0) return;
        // Find the first intersected mesh
        const intersection = e.intersections.find(i => i.object && i.object.isMesh);
        if (intersection) {
          onMeshClick(e, intersection.object.name);
        }
      }}
    />
  );
};

// Rotation Handle Component
const RotationHandle = ({ onRotate, isSelected }) => {
  if (!isSelected) return null;

  return (
    <mesh
      position={[0, 0.5, 1.5]} // Positioned slightly outside and above the base
      {...onRotate()}
      visible={isSelected}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

const FurnitureItem = ({ item, isSelected, onSelect }) => {
  const meshRef = useRef();
  const { camera, scene, controls } = useThree();
  const { updateFurniture, room, isPaintMode, activePaintColor } = useDesign();

  const [position, setPosition] = useState([item.position.x, item.position.y, item.position.z]);
  const [rotation, setRotation] = useState([item.rotation.x, item.rotation.y, item.rotation.z]);
  const [hovered, setHovered] = useState(false);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isPaintMode) {
      document.body.style.cursor = 'crosshair';
      return;
    }
    if (isDragging.current) {
      document.body.style.cursor = 'grabbing';
    } else if (hovered && isSelected) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, isPaintMode, isSelected]);

  useEffect(() => {
    if (!isDragging.current) {
        setPosition([item.position.x, item.position.y, item.position.z]);
        setRotation([item.rotation.x, item.rotation.y, item.rotation.z]);
    }
  }, [item.position, item.rotation]);

  const dims = item.furnitureId?.dimensions || { width: 1, height: 1, depth: 1 };
  const modelUrl = item.furnitureId?.modelUrl;
  const realWorldWidthMeters = item.furnitureId?.realWorldWidthMeters || 1;

  const roundToDecimals = (val, decimals = 3) => Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);

  // OPTIMIZED: Collision Detection
  const getIntersectingBox = (prospectiveBox) => {
    if (room && room.dimensions) {
      const { length, width } = room.dimensions;
      if (
        prospectiveBox.min.x < -length / 2 ||
        prospectiveBox.max.x > length / 2 ||
        prospectiveBox.min.z < -width / 2 ||
        prospectiveBox.max.z > width / 2
      ) {
        return true;
      }
    }

    let collision = false;
    const scaleFactor = 0.5; 
    
    // Scale prospective box
    const prospectiveCenter = new Vector3();
    const prospectiveSize = new Vector3();
    prospectiveBox.getCenter(prospectiveCenter);
    prospectiveBox.getSize(prospectiveSize);
    const scaledProspectiveBox = new Box3().setFromCenterAndSize(
      prospectiveCenter,
      prospectiveSize.multiplyScalar(scaleFactor)
    );

    scene.traverse((child) => {
      // Small optimization: stop traversing if collision is already found
      if (collision) return; 
      
      if (child.userData && child.userData.isFurniture && child.userData.id !== item._id) {
        const otherBox = new Box3().setFromObject(child);
        const otherCenter = new Vector3();
        const otherSize = new Vector3();
        otherBox.getCenter(otherCenter);
        otherBox.getSize(otherSize);

        const scaledOtherBox = new Box3().setFromCenterAndSize(
          otherCenter,
          otherSize.multiplyScalar(scaleFactor)
        );

        if (scaledProspectiveBox.intersectsBox(scaledOtherBox)) {
          collision = true;
        }
      }
    });
    return collision;
  };

  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const raycaster = useMemo(() => new Raycaster(), []);
  const dragOffset = useRef(new Vector3());

  const bindDrag = useDrag(({ event, active, first, last, xy: [clientX, clientY] }) => {
    if (!isSelected || isPaintMode) return;

    if (controls) controls.enabled = !active;

    if (active) {
      if (!isDragging.current) {
        isDragging.current = true;
        document.body.style.cursor = 'grabbing';
      }
      event.stopPropagation();

      const pointer = new Vector3(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      raycaster.setFromCamera(pointer, camera);
      const intersectPoint = new Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (first) {
        dragOffset.current.copy(intersectPoint).sub(meshRef.current.position);
      }

      const newPos = intersectPoint.clone().sub(dragOffset.current);

      // OPTIMIZED: Fast math-based bounding box translation
      const prospectiveBox = new Box3().setFromObject(meshRef.current);
      const delta = newPos.clone().sub(meshRef.current.position);
      prospectiveBox.translate(delta); // Shifts the box without cloning the mesh!

      if (!getIntersectingBox(prospectiveBox)) {
        setPosition([newPos.x, item.position.y, newPos.z]); 
        if (meshRef.current) {
          meshRef.current.position.set(newPos.x, item.position.y, newPos.z);
        }
      }
    }

    if (last) {
      isDragging.current = false;
      document.body.style.cursor = hovered ? 'grab' : 'auto';
      
      updateFurniture(room._id, item._id, {
        position: {
          x: roundToDecimals(meshRef.current.position.x),
          y: roundToDecimals(item.position.y),
          z: roundToDecimals(meshRef.current.position.z),
        },
        // It is safer to read rotation from the mesh directly on drop
        rotation: { 
            x: roundToDecimals(meshRef.current.rotation.x), 
            y: roundToDecimals(meshRef.current.rotation.y), 
            z: roundToDecimals(meshRef.current.rotation.z) 
        },
        scale: item.scale,
      });
    }
  }, { pointerEvents: true });
  const bindRotate = useDrag(({ event, active, last, xy: [clientX, clientY] }) => {
    if (!isSelected || isPaintMode) return; // Do not allow rotating if in Paint Mode

    // Disable orbit controls while dragging
    if (controls) controls.enabled = !active;

    if (active) {
        if (!isDragging.current) {
            isDragging.current = true;
            document.body.style.cursor = 'grabbing';
        }
        event.stopPropagation();

        const pointer = new Vector3(
            (clientX / window.innerWidth) * 2 - 1,
            -(clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        raycaster.setFromCamera(pointer, camera);
        const intersectPoint = new Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);

        // Calculate angle between the object's center and the mouse intersection point
        const objectPos = meshRef.current.position;
        const dx = intersectPoint.x - objectPos.x;
        const dz = intersectPoint.z - objectPos.z;
        const angle = Math.atan2(dx, dz); // Using dx, dz for Y-axis rotation

        // Update local state for real-time visual
        setRotation([rotation[0], angle, rotation[2]]);
        if (meshRef.current) {
           meshRef.current.rotation.y = angle;
        }
    }

    if (last) {
        isDragging.current = false;
        if (hovered) {
            document.body.style.cursor = 'grab';
        } else {
            document.body.style.cursor = 'auto';
        }
        const newRot = {
            x: roundToDecimals(rotation[0]),
            y: roundToDecimals(meshRef.current.rotation.y),
            z: roundToDecimals(rotation[2])
        };

        updateFurniture(room._id, item._id, {
            position: { x: position[0], y: position[1], z: position[2] },
            rotation: newRot,
            scale: item.scale,
        });
    }
  }, { pointerEvents: true });

  const FallbackMesh = (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[dims.width, dims.height, dims.depth]} />
      <meshStandardMaterial color={item.color || '#ffffff'} />
    </mesh>
  );

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[item.scale.x, item.scale.y, item.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item._id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        setHovered(false);
      }}
      userData={{ isFurniture: true, id: item._id }}
      {...bindDrag()}
    >
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[realWorldWidthMeters/2 + 0.1, realWorldWidthMeters/2 + 0.2, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
        </mesh>
      )}

      {/* The rotation handle is a child of the group so it rotates with the object,
          but we apply a separate useDrag to it. */}
      <RotationHandle onRotate={bindRotate} isSelected={isSelected} />

      {modelUrl ? (
        <ModelErrorBoundary fallback={FallbackMesh}>
           <Suspense fallback={FallbackMesh}>
              <GLTFModel
                url={modelUrl}
                customColors={item.customColors ? (typeof item.customColors.get === 'function' ? Object.fromEntries(item.customColors) : item.customColors) : {}}
                realWorldWidthMeters={realWorldWidthMeters}
                onMeshClick={(e, meshName) => {
                  if (isSelected && isPaintMode) {
                    e.stopPropagation(); // Prevent re-selection drag conflicts
                    const currentCustomColors = item.customColors ? (typeof item.customColors.get === 'function' ? Object.fromEntries(item.customColors) : item.customColors) : {};
                    const newCustomColors = { ...currentCustomColors, [meshName]: activePaintColor };
                    updateFurniture(room._id, item._id, {
                      customColors: newCustomColors
                    });
                  }
                }}
              />
           </Suspense>
        </ModelErrorBoundary>
      ) : FallbackMesh}
    </group>
  );
};

export default FurnitureItem;
