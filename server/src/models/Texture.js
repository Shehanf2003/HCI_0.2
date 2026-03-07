const mongoose = require('mongoose');

const textureSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['wall', 'floor'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Texture = mongoose.model('Texture', textureSchema);

module.exports = Texture;
