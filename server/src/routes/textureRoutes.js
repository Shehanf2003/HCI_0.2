const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadTextureFile, uploadTexture, getTextures } = require('../controllers/textureController');

const router = express.Router();

// @desc    Upload new texture item
// @route   POST /api/textures/upload
// @access  Private/Admin
router.post('/upload', protect, admin, uploadTextureFile.single('file'), uploadTexture);

// @desc    Get all textures
// @route   GET /api/textures
// @access  Private
router.get('/', protect, getTextures);

module.exports = router;
