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

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();

      const intersection = raycaster.ray.intersectPlane(plane, target);

      if (intersection) {
        
        const newItem = {
          furnitureId,
          position: {
            x: intersection.x,
            y: 0,
            z: intersection.z
          },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 }, 
          color: '#ffffff', 
        };

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
