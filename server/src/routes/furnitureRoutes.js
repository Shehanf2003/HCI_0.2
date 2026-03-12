const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadFurniture, updateFurniture, deleteFurniture } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', protect, admin, uploadFurniture);

router.route('/:id')
  .put(protect, admin, updateFurniture)
  .delete(protect, admin, deleteFurniture);

module.exports = router;
