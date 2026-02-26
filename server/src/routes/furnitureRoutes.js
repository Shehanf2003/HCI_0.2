const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadFurniture } = require('../controllers/uploadController');

const router = express.Router();

// @desc    Upload new furniture item
// @route   POST /api/furniture/upload
// @access  Private/Admin
router.post('/upload', protect, admin, upload.single('file'), uploadFurniture);

module.exports = router;
