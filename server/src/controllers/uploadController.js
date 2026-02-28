const path = require('path');
const multer = require('multer');
const Furniture = require('../models/Furniture');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /glb|gltf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Accept binary for GLB
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('GLB/GLTF files only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload new furniture item
// @route   POST /api/furniture/upload
// @access  Private/Admin
const updateFurniture = async (req, res) => {
  try {
    const { name, type, width, height, depth, price, description, color } = req.body;

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

      // If a new file is uploaded, update the modelUrl
      if (req.file) {
        furniture.modelUrl = `/uploads/${req.file.filename}`;
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
    const { name, type, width, height, depth, price, description, color } = req.body;

    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a GLB file' });
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
      modelUrl: `/uploads/${req.file.filename}`, // Relative path to be served statically
      imageUrl: '', // Will use auto-generated thumbnail
    });

    const createdFurniture = await furniture.save();
    res.status(201).json(createdFurniture);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  upload,
  uploadFurniture,
  updateFurniture,
  deleteFurniture,
};
