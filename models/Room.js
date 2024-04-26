const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    hotel:{
        type:mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required:true
    },
    type:{
        type:String,
        required:true
    },
    pricepernight: {
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('Room',RoomSchema);