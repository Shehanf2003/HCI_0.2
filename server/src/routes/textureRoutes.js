const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadTextureFile, uploadTexture, getTextures } = require('../controllers/textureController');

const router = express.Router();

router.post('/upload', protect, admin, uploadTextureFile.single('file'), uploadTexture);

router.get('/', protect, getTextures);

module.exports = router;
