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
const Furniture = require('../models/Furniture');


router.get('/furniture', protect, async (req, res) => {
    const furniture = await Furniture.find({});
    res.json(furniture);
});

router.route('/rooms')
    .get(protect, getRooms)
    .post(protect, createRoom);

router.route('/rooms/:id')
    .get(protect, getRoomById)
    .put(protect, updateRoomSpecs)
    .delete(protect, deleteRoom);

router.route('/designs/:roomId')
    .get(protect, getDesign);

router.route('/designs/:roomId/furniture')
    .post(protect, addFurnitureItem);

router.route('/designs/:roomId/furniture/:itemId')
    .put(protect, updateFurnitureItem)
    .delete(protect, removeFurnitureItem);


module.exports = router;
