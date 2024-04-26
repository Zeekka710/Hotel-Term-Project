const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const DiscountCode = require('../models/DiscountCode');

//@desc Get all booking
//@route GET /api/v1/bookings
//@access Public
exports.getBookings = async (req,res,next)=>{
    let query;
    //General users can see only their appointments!
    if(req.user.role !== 'admin'){
        query=Booking.find({user: req.user.id}).populate({
            path:'hotel',
            select:'name province tel'
        });
    }else{//If you are an admin, you can see all!}

        if(req.params.hotelId) {
            console.log(req.params.hotelId);

            query = Booking.find({hotel: req.params.hotelId}).populate({
                path: "hotel",
                select: "name province tel"
            })
        } else 
        
        query = Booking.find().populate({
            path:'hotel',
            select:'name province tel'
        });
}

try {
    const bookings= await query;
    res.status(200).json({
        success:true,
        count:bookings.length,
        data:bookings
    });
} catch (error) {
    console.log(error);
    return res.status(500).json({success:false,message:"Cannot find Booking"});
}

};

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking= async (req,res,next)=>{
    try {
        const booking = await Booking.findById(req.params.id).populate({
                path: 'hotel',
                select: 'name address tel'
            });

        if(!booking){
            return res.status(404).json({success:false, message:`No booking with the id of ${req.params.id}`});
        }
        
        res.status(200).json({
            success:true,
            data: booking
        });
    } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,message:"Cannot find booking"});
}

};

//@desc Create booking
//@route POST /api/v1/hotels/:hotelId/booking
//@access Private

exports.createBooking= async (req,res,next)=>{
    try {
        req.body.hotel=req.params.hotelId;
        req.body.user=req.user.id;
        
        const hotel = await Hotel.findById(req.params.hotelId);
        const bookRoom = await Room.find({type: req.body.room}).distinct('hotel');

        let diff_date = new Date(req.body.CheckoutDate).getTime() - new Date(req.body.CheckinDate).getTime();
        let days = Math.round(diff_date/(1000*60*60*24));
        let discount = req.body.discountCode;

        if(!hotel){
            return res.status(404).json({success:false, message: `No hotel with the id of ${req.params.hotelId}`});
            }

        if(bookRoom != req.params.hotelId){
            return res.status(404).json({success:false, message: `The room you looking for is not available ${bookRoom}`});
            }
            
        if (days > 3 || days < 0){
            return res.status(500).json({success:false, message: `The duration is not in the range of 3 nights, please try again`});
        }

        const bookPrice = await Room.find({type: req.body.room}, Hotel.pricepernight).distinct('pricepernight');
        let percentdiscount = 1;
        let codeCheck = await Booking.find({user:req.body.user}).distinct('discountCode');

        if (discount == 'aJeUQ0pMpt' && !codeCheck.includes('aJeUQ0pMpt')){
            percentdiscount = 0.95;
        }
        if (discount == 'ZfiGcTdZnn' && !codeCheck.includes('ZfiGcTdZnn')){
            percentdiscount = 0.90;
        }
        if (discount == 'RjUxLF74jL' && !codeCheck.includes('RjUxLF74jL')){
            percentdiscount = 0.85;
        }
        if (discount == 'aJeUQ0pMptL' && req.params.hotelId == '6623e6f7e303cc63e8864ca4'&& !codeCheck.includes('aJeUQ0pMptL')){ 
            percentdiscount = 0.95;
        }
        if (discount == 'Uloe1aV66K' && req.body.room == 'Executive Suite' && !codeCheck.includes('Uloe1aV66K')){
            percentdiscount = 0.80;
        }

        req.body.totalPrice = bookPrice * percentdiscount;
        let codeDesc = await DiscountCode.find({code:req.body.discountCode}).distinct('description');

        if(req.body.totalPrice==bookPrice){
            //req.body.discountCode = null
            const booking = await Booking.create(req.body);
            res.status(201).json({
                success:true,
                data:booking,
                message:`Your code might be ${codeDesc}invalid or expired. Then the total Price is ${req.body.totalPrice} Baht. discount Thank you! Please Check in after 2.00pm` 
            });
        } else {
            let codeDesc = await DiscountCode.find({code:req.body.discountCode}).distinct('description');
            const booking = await Booking.create(req.body);
            res.status(201).json({
                success:true,
                data:booking,
                message:`Already applied ${codeDesc} Total Price is ${req.body.totalPrice} Baht. discount Thank you! Please Check in after 2.00pm` 
            });
        } 
        } catch (error) {
            console.log(error);

            return res.status(500).json({success:false,message:"Cannot create Booking"});
        }   

};

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private

exports.updateBooking= async (req,res,next)=>{
    try {
        let booking = await Booking.findById(req.params.id);

        if(!booking){
            
            return res.status(404).json({
                success:false,
                message:`No booking with the id of ${req.params.id}`});

        }
        // Make sure user is the booking owner
        if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this booking`});
        }
            booking=await Booking.findByIdAndUpdate(req.params.id,req.body,{
                new:true,
                runValidators:true
            });
                
            res.status(200).json({
                success:true,
                data: {}
            }); 

        } catch (error) {
            console.log(error);

            return res.status(500).json({success:false,message:"Cannot update Booking"});
        }   

};


//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private

exports.deleteBooking = async (req,res,next)=>{
    try {
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            
            return res.status(404).json({
                success:false,
                message:`No booking with the id of ${req.params.id}`});

        }
        // Make sure user is the booking owner
        if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this booking`});
        }
            await booking.deleteOne();
                
            res.status(200).json({
                success:true,
                data: {}
            }); 
        } catch (error) {
            console.log(error);

            return res.status(500).json({success:false,message:"Cannot delete Booking"});
        }   

};