const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoomSpecs,
  deleteRoom,
} = require('../controllers/roomController');
const {
  addFurnitureItem,
  updateFurnitureItem,
  removeFurnitureItem,
  getDesign
} = require('../controllers/designController');
const { protect } = require('../middleware/authMiddleware');
const Furniture = require('../models/Furniture'); // For fetching list of furniture

// Furniture listing
router.get('/furniture', protect, async (req, res) => {
    const furniture = await Furniture.find({});
    res.json(furniture);
});

// Room routes
router.route('/rooms')
    .get(protect, getRooms)
    .post(protect, createRoom);

router.route('/rooms/:id')
    .get(protect, getRoomById)
    .put(protect, updateRoomSpecs)
    .delete(protect, deleteRoom);

// Design routes (operating on room's furniture)
router.route('/designs/:roomId')
    .get(protect, getDesign);

router.route('/designs/:roomId/furniture')
    .post(protect, addFurnitureItem);

// The controller `updateFurnitureItem` expects `req.params.itemId` but my controller was looking for `itemId` in params.
// The route definition needs to match.
// `req.params.itemId` in controller.
router.route('/designs/:roomId/furniture/:itemId')
    .put(protect, updateFurnitureItem)
    .delete(protect, removeFurnitureItem);


module.exports = router;
