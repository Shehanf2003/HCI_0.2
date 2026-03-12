const mongoose = require('mongoose');

const furnitureSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, 
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      depth: { type: Number, required: true },
    },
    description: {
      type: String,
      default: '',
    },
    defaultColor: {
      type: String,
      default: '#ffffff',
    },
    price: {
      type: Number,
      default: 0,
    },
    realWorldWidthMeters: {
      type: Number,
      required: true,
      min: [0.01, 'realWorldWidthMeters must be greater than 0'],
    },
    imageUrl: {
      type: String, 
    },
    modelUrl: {
      type: String, 
    }
  },
  {
    timestamps: true,
  }
);

const Furniture = mongoose.model('Furniture', furnitureSchema);

module.exports = Furniture;
