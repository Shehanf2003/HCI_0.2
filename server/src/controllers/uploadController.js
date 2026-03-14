const Furniture = require('../models/Furniture');

const updateFurniture = async (req, res) => {
  try {
    const { name, type, width, height, depth, price, description, color, realWorldWidthMeters, modelUrl } = req.body;

    const furniture = await Furniture.findById(req.params.id);

    if (furniture) {
      furniture.name = name || furniture.name;
      furniture.type = type || furniture.type;

      if (width && height && depth) {
        furniture.dimensions = {
          width: Number(width),
          height: Number(height),
          depth: Number(depth),
        };
      }

      furniture.price = price ? Number(price) : furniture.price;
      furniture.description = description || furniture.description;
      furniture.defaultColor = color || furniture.defaultColor;

      if (realWorldWidthMeters) {
        furniture.realWorldWidthMeters = Number(realWorldWidthMeters);
      }

      if (modelUrl) {
        furniture.modelUrl = modelUrl;
      }

      const updatedFurniture = await furniture.save();
      res.json(updatedFurniture);
    } else {
      res.status(404).json({ message: 'Furniture not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (furniture) {
      await furniture.deleteOne();
      res.json({ message: 'Furniture removed' });
    } else {
      res.status(404).json({ message: 'Furniture not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

const uploadFurniture = async (req, res) => {
  try {
    const { name, type, width, height, depth, price, description, color, realWorldWidthMeters, modelUrl } = req.body;

    if (!realWorldWidthMeters || Number(realWorldWidthMeters) <= 0) {
        return res.status(400).json({ message: 'Please provide a valid realWorldWidthMeters (> 0)' });
    }

    if (!modelUrl) {
      return res.status(400).json({ message: 'Please provide a modelUrl' });
    }

    const furniture = new Furniture({
      name,
      type,
      dimensions: {
        width: Number(width),
        height: Number(height),
        depth: Number(depth),
      },
      price: Number(price),
      description: description || '',
      defaultColor: color || '#ffffff',
      realWorldWidthMeters: Number(realWorldWidthMeters),
      modelUrl: modelUrl,
      imageUrl: '',
    });

    const createdFurniture = await furniture.save();
    res.status(201).json(createdFurniture);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  uploadFurniture,
  updateFurniture,
  deleteFurniture,
};
