const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,'Please add a name'],
        unique:true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 chararcters']
    },
    address:{
        type: String,
        required: [true,'Please add an address']
    
    },
    district:{
        type: String,
        required: [true,'Please add a district']
    
    },
    province:{
        type: String,
        required: [true,'Please add a province']
    
    },
    postalcode:{
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength: [5,'Postal Code can not be more than 5 digits']
    },
    tel:{
        type: String
    },

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//Reverse populate with virtuals
HotelSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField: 'hotel',
    justone:false
});

HotelSchema.virtual('rooms',{
    ref: 'Room',
    localField: '_id',
    foreignField: 'hotel',
    justone:false
});

//Cascade delete appoints when a hospital is deleted
HotelSchema.pre('deleteOne', {document:true, query:false}, async function(next){
    console.log(`Bookings being removed from hotel ${this._id}`);
    await this.model('Booking').deleteMany({hotel: this._id});
    next();
});

module.exports=mongoose.model('Hotel',HotelSchema);