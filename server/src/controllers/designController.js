const Room = require('../models/Room');
const Furniture = require('../models/Furniture');
const { calculateScaledDimensions, fitsInRoom } = require('../services/furnitureService');
const { calculateTotalDesignCost } = require('../services/pricingService');

const addFurnitureItem = async (req, res) => {
  const { furnitureId, position, rotation, scale, color, customColors } = req.body;

  const room = await Room.findById(req.params.roomId);

  if (room) {
    if (room.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    let finalScale = scale || { x: 1, y: 1, z: 1 };

    const newItem = {
      furnitureId,
      position,
      rotation,
      scale: finalScale,
      color,
      customColors: customColors || {}
    };

    room.furnitureItems.push(newItem);
    await room.save();
    const updatedRoom = await Room.findById(room._id).populate('furnitureItems.furnitureId');
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};


const updateFurnitureItem = async (req, res) => {
  const { position, rotation, scale, color, customColors } = req.body;
  const room = await Room.findById(req.params.roomId);

  if (room) {
      if (room.user.toString() !== req.user._id.toString()) {
          res.status(401);
          throw new Error('Not authorized');
      }

      const itemIndex = room.furnitureItems.findIndex(item => item._id.toString() === req.params.itemId);

      if (itemIndex > -1) {
          const item = room.furnitureItems[itemIndex];
          if (position !== undefined) item.position = position;
          if (rotation !== undefined) item.rotation = rotation;
          if (scale !== undefined) item.scale = scale;
          if (color !== undefined) item.color = color;
          if (customColors !== undefined) item.customColors = customColors;

          room.furnitureItems[itemIndex] = item;
          room.markModified('furnitureItems');
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

const getDesign = async (req, res) => {

    const room = await Room.findById(req.params.roomId).populate('furnitureItems.furnitureId');

    if (room) {
        if (room.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        
        const totalCost = calculateTotalDesignCost(room.furnitureItems);

       
        const response = room.toJSON();
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
