export const snapToGrid = (value, gridSize = 0.5) => {
  return Math.round(value / gridSize) * gridSize;
};

export const calculateArea = (width, length) => {
  return width * length;
};

export const checkCollision = (item1, item2) => {
  // Simple AABB collision check in 2D (x, z)
  // item: { position: { x, z }, dimensions: { width, depth } }
  // This is a placeholder for more complex logic
  return false;
};
