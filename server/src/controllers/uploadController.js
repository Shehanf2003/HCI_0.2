require('dotenv').config();
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Furniture = require('../models/Furniture');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

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

const uploadToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: '3d-models',
        resource_type: 'raw',
        public_id: `${path.parse(originalname).name}-${Date.now()}${path.extname(originalname)}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// @desc    Upload new furniture item
// @route   POST /api/furniture/upload
// @access  Private/Admin
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

      // If a new file is uploaded, update the modelUrl
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        furniture.modelUrl = result.secure_url;
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

    // Check if file is uploaded
    if (!modelUrl && !req.file) {
        return res.status(400).json({ message: 'Please upload a GLB file' });
    }

    if (!realWorldWidthMeters || Number(realWorldWidthMeters) <= 0) {
        return res.status(400).json({ message: 'Please provide a valid realWorldWidthMeters (> 0)' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

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
      modelUrl: result.secure_url,
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
