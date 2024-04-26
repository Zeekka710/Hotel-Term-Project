const mongoose = require('mongoose');

const BookingSchema=new mongoose.Schema({
    CheckinDate: {
        type: Date,
        required:true
    },
    CheckoutDate: {
        type: Date,
        required:true
    },
    hotel:{
        type:mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required:true
    },
    room:{
        type:String,
        required:true
    },
    discountCode:{
        type:String,
        default:null
    },
    totalPrice:{
        type:Number,
    },
    user: {
        type:mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAT: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Booking',BookingSchema);