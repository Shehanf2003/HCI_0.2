import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDesign } from '../context/DesignContext';

const DragDropController = () => {
  const { camera, gl } = useThree();
  const { addFurniture, room } = useDesign();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e) => {
      e.preventDefault();

      const furnitureId = e.dataTransfer.getData('furnitureId');
      if (!furnitureId || !room) return;

      // Calculate mouse position in Normalized Device Coordinates (NDC)
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Create a raycaster from the camera
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);

      // Create a virtual floor plane at y=0
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();

      // Intersect ray with plane
      const intersection = raycaster.ray.intersectPlane(plane, target);

      if (intersection) {
        // Prepare the new item
        const newItem = {
          furnitureId,
          position: {
            x: intersection.x,
            y: 0,
            z: intersection.z
          },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 }, // Default scale, will be auto-scaled by backend or we can do it here
          color: '#ffffff', // Default color, or fetch from catalog if passed
        };

        // If we have default color passed via drag data, we could use it
        // For now, let's just stick to the ID and let backend/context handle defaults or updates

        addFurniture(room._id, newItem);
      }
    };

    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);

    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
    };
  }, [camera, gl, addFurniture, room]);

  return null;
};

export default DragDropController;
