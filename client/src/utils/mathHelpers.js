export const snapToGrid = (value, gridSize = 0.5) => {
  return Math.round(value / gridSize) * gridSize;
};

export const calculateArea = (width, length) => {
  return width * length;
};

export const checkCollision = (item1, item2) => {
  return false;
};
