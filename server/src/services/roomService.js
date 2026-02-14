// server/src/services/roomService.js

/**
 * Calculates the floor area of a room
 * @param {Number} length
 * @param {Number} width
 * @returns {Number} Area in square units
 */
const calculateArea = (length, width) => {
  return length * width;
};

/**
 * Calculates the volume of a room
 * @param {Number} length
 * @param {Number} width
 * @param {Number} height
 * @returns {Number} Volume in cubic units
 */
const calculateVolume = (length, width, height) => {
  return length * width * height;
};

/**
 * Validates if room dimensions are within acceptable limits
 * @param {Object} dimensions - { length, width, height }
 * @returns {boolean}
 */
const isValidRoom = (dimensions) => {
  const { length, width, height } = dimensions;
  // Example limits
  if (length < 1 || width < 1 || height < 1) return false;
  if (length > 100 || width > 100 || height > 20) return false; // Arbitrary max limits
  return true;
};

module.exports = {
  calculateArea,
  calculateVolume,
  isValidRoom,
};
