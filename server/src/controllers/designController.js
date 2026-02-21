const Room = require('../models/Room');
const Furniture = require('../models/Furniture');
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

    let finalScale = scale;

    // Auto-scaling logic if scale is not explicitly customized (assuming 1,1,1 is default)
    // Or we force auto-scale on first add
    if (!scale || (scale.x === 1 && scale.y === 1 && scale.z === 1)) {
       const furniture = await Furniture.findById(furnitureId);
       if (furniture && furniture.dimensions && room.dimensions) {
          // General rule: furniture width should be approx 20% of room width (z-axis in Room model seems to correspond to width)
          // Room dimensions: length (x), width (z), height (y)
          // Furniture dimensions: width, height, depth

          const targetRatio = 0.20; // 20%
          // Use room's smallest horizontal dimension to be safe
          const roomMinDim = Math.min(room.dimensions.length, room.dimensions.width);

          // Calculate scale factor based on width
          // Assuming furniture 'width' aligns with room horizontal plane
          let scaleFactor = (roomMinDim * targetRatio) / furniture.dimensions.width;

          // Ensure scale factor is reasonable (not too small, not too huge)
          // If the object is already big enough (e.g. scaleFactor < 1), we might keep it as is, or enforce consistency.
          // The user said "object is smaller than room", implying we need to scale UP or fix units.
          // If the model is in different units (e.g. mm vs m), scaleFactor could be huge or tiny.

          // Let's apply the calculated scale uniformly
          finalScale = {
              x: scaleFactor,
              y: scaleFactor,
              z: scaleFactor
          };
       }
    }

    const newItem = {
      furnitureId,
      position,
      rotation,
      scale: finalScale,
      color
    };

    // Optional: Validate if it fits
    // const furniture = await Furniture.findById(furnitureId);
    // if (!fitsInRoom(position, calculateScaledDimensions(furniture.dimensions, scale), room.dimensions)) ...

    room.furnitureItems.push(newItem);
    await room.save();
    const updatedRoom = await Room.findById(room._id).populate('furnitureItems.furnitureId');
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
          await room.save();
          const updatedRoom = await Room.findById(room._id).populate('furnitureItems.furnitureId');
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

    await room.save();
    const updatedRoom = await Room.findById(room._id).populate('furnitureItems.furnitureId');
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
