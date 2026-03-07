require('dotenv').config();
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Texture = require('../models/Texture');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png, webp)!'));
  }
}

const uploadTextureFile = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const uploadToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'textures',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const uploadTexture = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image file' });
    }

    if (!['wall', 'floor'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either wall or floor' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    const texture = new Texture({
      name,
      type,
      url: result.secure_url,
    });

    const createdTexture = await texture.save();
    res.status(201).json(createdTexture);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

const getTextures = async (req, res) => {
    try {
        const textures = await Texture.find({});
        res.json(textures);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
}

module.exports = {
  uploadTextureFile,
  uploadTexture,
  getTextures
};
