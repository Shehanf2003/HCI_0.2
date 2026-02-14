const Room = require('../models/Room');
const { calculateArea, calculateVolume, isValidRoom } = require('../services/roomService');

// @desc    Get all rooms for a user
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
  const rooms = await Room.find({ user: req.user._id });
  res.json(rooms);
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Private
const getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    // Check if user owns the room
    if (room.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this room');
    }
    res.json(room);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};

// @desc    Create a new room (initial specs)
// @route   POST /api/rooms
// @access  Private
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
    furnitureItems: [], // Start empty
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
};

// @desc    Update room specs (size/color/shape)
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoomSpecs = async (req, res) => {
  const { name, dimensions, shape, colorScheme } = req.body;

  const room = await Room.findById(req.params.id);

  if (room) {
    if (room.user.toString() !== req.user._id.toString()) {
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
    room.colorScheme = colorScheme || room.colorScheme;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    if (room.user.toString() !== req.user._id.toString()) {
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
