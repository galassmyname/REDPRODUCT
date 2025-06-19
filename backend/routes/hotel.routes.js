const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// Créer un hôtel avec upload de photos
// Dans hotel.routes.js
router.post('/', hotelController.uploadHotelPhoto, hotelController.createHotel);
// // Autres routes
router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getHotel);
router.put('/:id', hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;