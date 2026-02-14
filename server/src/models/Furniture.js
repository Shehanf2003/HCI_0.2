const mongoose = require('mongoose');

const furnitureSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // e.g., 'chair', 'table', 'sofa'
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      depth: { type: Number, required: true },
    },
    defaultColor: {
      type: String,
      default: '#ffffff',
    },
    price: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String, // Optional, for UI preview
    }
  },
  {
    timestamps: true,
  }
);

const Furniture = mongoose.model('Furniture', furnitureSchema);

module.exports = Furniture;
