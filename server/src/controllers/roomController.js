const Room = require('../models/Room');
const { calculateArea, calculateVolume, isValidRoom } = require('../services/roomService');

const getRooms = async (req, res) => {
  const rooms = await Room.find({ user: req.user._id });
  res.json(rooms);
};


const getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
   
    if (room.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to access this room');
    }
    res.json(room);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};

const createRoom = async (req, res) => {
  const { name, dimensions, shape, colorScheme } = req.body;

  if (!isValidRoom(dimensions)) {
    res.status(400);
    throw new Error('Invalid room dimensions');
  }

  const room = new Room({
    user: req.user._id,
    name,
    dimensions,
    shape,
    colorScheme,
    furnitureItems: [],
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
};


const updateRoomSpecs = async (req, res) => {
  const { name, dimensions, shape, colorScheme } = req.body;

  const room = await Room.findById(req.params.id);

  if (room) {
    if (room.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (dimensions && !isValidRoom(dimensions)) {
       res.status(400);
       throw new Error('Invalid dimensions');
    }

    room.name = name || room.name;
    room.dimensions = dimensions || room.dimensions;
    room.shape = shape || room.shape;
    
    if (colorScheme) {
        Object.assign(room.colorScheme, colorScheme);
        room.markModified('colorScheme');
    }

    await room.save();
    
    const updatedRoom = await Room.findById(room._id).populate('furnitureItems.furnitureId');
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};

const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    if (room.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }
    await room.deleteOne();
    res.json({ message: 'Room removed' });
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoomSpecs,
  deleteRoom,
};
