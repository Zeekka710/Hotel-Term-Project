const express = require('express');
const {getHotel, getHotels, createHotel, updateHotel, deleteHotel,
       getBookCenters} = require('../controllers/hotel');

//Include other resource routers
const bookingRouter=require('./booking');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:hotelId/bookings/', bookingRouter);

router.route('/bookCenters').get(getBookCenters);
router.route('/').get(getHotels).post(protect,authorize('admin'),createHotel);
router.route('/:id').get(getHotel).put(protect,authorize('admin'),updateHotel).delete(protect,authorize('admin'),deleteHotel);

module.exports=router;