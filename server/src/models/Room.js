const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      default: 'My Room Design',
    },
    // Room Specifications
    dimensions: {
      length: { type: Number, required: true }, // x
      width: { type: Number, required: true },  // z
      height: { type: Number, required: true }, // y
    },
    shape: {
      type: String,
      default: 'rectangular',
    },
    colorScheme: {
      wallColor: { type: String, default: '#e0e0e0' },
      floorColor: { type: String, default: '#8d6e63' },
    },
    // Design Layout (Furniture placement)
    furnitureItems: [
      {
        furnitureId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Furniture',
          required: true,
        },
        position: {
          x: { type: Number, default: 0 },
          y: { type: Number, default: 0 },
          z: { type: Number, default: 0 },
        },
        rotation: {
          x: { type: Number, default: 0 },
          y: { type: Number, default: 0 },
          z: { type: Number, default: 0 },
        },
        scale: {
          x: { type: Number, default: 1 },
          y: { type: Number, default: 1 },
          z: { type: Number, default: 1 },
        },
        color: {
          type: String, // Override default color if needed
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
