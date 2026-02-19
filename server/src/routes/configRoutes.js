const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getConfig)
  .put(protect, updateConfig);

module.exports = router;
