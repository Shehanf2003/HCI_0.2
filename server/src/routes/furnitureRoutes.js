const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadFurniture, updateFurniture, deleteFurniture } = require('../controllers/uploadController');

const router = express.Router();

// @desc    Upload new furniture item
// @route   POST /api/furniture/upload
// @access  Private/Admin
router.post('/upload', protect, admin, upload.single('file'), uploadFurniture);

// @desc    Update/Delete furniture item
// @route   PUT/DELETE /api/furniture/:id
// @access  Private/Admin
router.route('/:id')
  .put(protect, admin, upload.single('file'), updateFurniture)
  .delete(protect, admin, deleteFurniture);

module.exports = router;
