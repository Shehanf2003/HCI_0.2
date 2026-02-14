// server/src/services/pricingService.js

/**
 * Calculates the total cost of all furniture items in a design
 * @param {Array} furnitureItems - Array of furniture objects
 * @returns {Number} Total price
 */
const calculateTotalDesignCost = (furnitureItems) => {
  return furnitureItems.reduce((acc, item) => {
    // Assuming item.furnitureId is populated or we have price
    // Since item is just a reference, we might not have price directly unless populated.
    // For now, assume it's passed in or calculate a dummy value
    return acc + (item.price || 0);
  }, 0);
};

module.exports = {
  calculateTotalDesignCost,
};
