const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadTexture, getTextures } = require('../controllers/textureController');

const router = express.Router();

router.post('/upload', protect, admin, uploadTexture);

router.get('/', protect, getTextures);

module.exports = router;
