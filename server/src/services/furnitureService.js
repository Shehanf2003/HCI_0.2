/**
 * Validates if the furniture fits within room bounds (basic check)
 * @param {Object} furniturePos - { x, y, z }
 * @param {Object} furnitureDims - { width, height, depth }
 * @param {Object} roomDims - { length, width, height }
 * @returns {boolean}
 */
const fitsInRoom = (furniturePos, furnitureDims, roomDims) => {
  const halfWidth = furnitureDims.width / 2;
  const halfDepth = furnitureDims.depth / 2;
  const halfRoomLength = roomDims.length / 2;
  const halfRoomWidth = roomDims.width / 2;

  if (furniturePos.x - halfWidth < -halfRoomLength || furniturePos.x + halfWidth > halfRoomLength) {
    return false;
  }

  if (furniturePos.z - halfDepth < -halfRoomWidth || furniturePos.z + halfDepth > halfRoomWidth) {
    return false;
  }

  return true;
};

module.exports = {
  fitsInRoom,
};
