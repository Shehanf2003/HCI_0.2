/**
 * Calculates the floor area of a room
 * @param {Object} dimensions - { length, width }
 * @returns {Number} Area in square units
 */
const calculateArea = (dimensions) => {
  const { length, width } = dimensions;
  return length * width;
};

/**
 * Calculates the volume of a room
 * @param {Object} dimensions - { length, width, height }
 * @returns {Number} Volume in cubic units
 */
const calculateVolume = (dimensions) => {
  const { length, width, height } = dimensions;
  return length * width * height;
};

/**
 * Validates if room dimensions are within acceptable limits
 * @param {Object} dimensions - { length, width, height }
 * @returns {boolean}
 */
const isValidRoom = (dimensions) => {
  if (!dimensions) return false;
  const { length, width, height } = dimensions;

  if (!length || !width || !height) return false;

  if (length < 1 || width < 1 || height < 1) return false;
  if (length > 100 || width > 100 || height > 20) return false;
  return true;
};

module.exports = {
  calculateArea,
  calculateVolume,
  isValidRoom,
};
