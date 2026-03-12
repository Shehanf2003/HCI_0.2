/**
 * Calculates the total cost of all furniture items in a design
 * @param {Array} furnitureItems - Array of furniture objects
 * @returns {Number} Total price
 */
const calculateTotalDesignCost = (furnitureItems) => {
  return furnitureItems.reduce((acc, item) => {
    const price = (item.furnitureId && item.furnitureId.price) ? item.furnitureId.price : 0;
    return acc + price;
  }, 0);
};

module.exports = {
  calculateTotalDesignCost,
};
