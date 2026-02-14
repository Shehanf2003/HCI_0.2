const Room = require('../models/Room');
const { calculateScaledDimensions, fitsInRoom } = require('../services/furnitureService');
const { calculateTotalDesignCost } = require('../services/pricingService');

// @desc    Add furniture to room (Create/Update Design)
// @route   POST /api/designs/:roomId/furniture
// @access  Private
const addFurnitureItem = async (req, res) => {
  const { furnitureId, position, rotation, scale, color } = req.body;

  const room = await Room.findById(req.params.roomId);

  if (room) {
    if (room.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const newItem = {
      furnitureId,
      position,
      rotation,
      scale,
      color
    };

    // Optional: Validate if it fits
    // const furniture = await Furniture.findById(furnitureId);
    // if (!fitsInRoom(position, calculateScaledDimensions(furniture.dimensions, scale), room.dimensions)) ...

    room.furnitureItems.push(newItem);
    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};

// @desc    Update furniture item in design
// @route   PUT /api/designs/:roomId/furniture/:itemId
// @access  Private
const updateFurnitureItem = async (req, res) => {
  const { position, rotation, scale, color } = req.body;
  const room = await Room.findById(req.params.roomId);

  if (room) {
      if (room.user.toString() !== req.user._id.toString()) {
          res.status(401);
          throw new Error('Not authorized');
      }

      const itemIndex = room.furnitureItems.findIndex(item => item._id.toString() === req.params.itemId);

      if (itemIndex > -1) {
          const item = room.furnitureItems[itemIndex];
          item.position = position || item.position;
          item.rotation = rotation || item.rotation;
          item.scale = scale || item.scale;
          item.color = color || item.color;

          room.furnitureItems[itemIndex] = item;
          const updatedRoom = await room.save();
          res.json(updatedRoom);
      } else {
          res.status(404);
          throw new Error('Item not found in design');
      }
  } else {
      res.status(404);
      throw new Error('Room not found');
  }
};

// @desc    Remove furniture item
// @route   DELETE /api/designs/:roomId/furniture/:itemId
// @access  Private
const removeFurnitureItem = async (req, res) => {
  const room = await Room.findById(req.params.roomId);

  if (room) {
    if (room.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    room.furnitureItems = room.furnitureItems.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};

// @desc    Get design details (including cost)
// @route   GET /api/designs/:roomId
// @access  Private
const getDesign = async (req, res) => {
    // This is similar to getRoomById but might include extra calculated fields
    const room = await Room.findById(req.params.roomId).populate('furnitureItems.furnitureId');

    if (room) {
        if (room.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        // Calculate total cost
        const totalCost = calculateTotalDesignCost(room.furnitureItems);

        // We can attach it to the response
        const response = room.toObject();
        response.totalCost = totalCost;

        res.json(response);
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
}


module.exports = {
  addFurnitureItem,
  updateFurnitureItem,
  removeFurnitureItem,
  getDesign
};
