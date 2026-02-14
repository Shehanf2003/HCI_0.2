// server/src/services/furnitureService.js

/**
 * Calculates new dimensions based on scale factor
 * @param {Object} originalDimensions - { width, height, depth }
 * @param {Object} scale - { x, y, z }
 * @returns {Object} - Scaled dimensions
 */
const calculateScaledDimensions = (originalDimensions, scale) => {
  return {
    width: originalDimensions.width * scale.x,
    height: originalDimensions.height * scale.y,
    depth: originalDimensions.depth * scale.z,
  };
};

/**
 * Validates if the furniture fits within room bounds (basic check)
 * @param {Object} furniturePos - { x, y, z }
 * @param {Object} furnitureDims - { width, height, depth }
 * @param {Object} roomDims - { length, width, height }
 * @returns {boolean}
 */
const fitsInRoom = (furniturePos, furnitureDims, roomDims) => {
  // Simple AABB check logic could go here
  // Assuming position is center of object
  const halfWidth = furnitureDims.width / 2;
  const halfDepth = furnitureDims.depth / 2;

  // Check bounds against room length/width
  // Room origin usually (0,0) to (length, width) or centered?
  // Let's assume room is centered at 0,0 for now in 3D space, or 0 to L/W
  // This is just a placeholder service logic
  return true;
};

module.exports = {
  calculateScaledDimensions,
  fitsInRoom,
};
