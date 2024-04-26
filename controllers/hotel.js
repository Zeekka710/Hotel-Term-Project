const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const bookCenter = require('../models/BookCenter');

//@desc Get booking centers
//@route GET /api/v1/hotels/bookCenters/
//@access Public
exports.getBookCenters=(req,res,next)=>{
    vacCenter.getAll((err, data)=>{
        if (err)
        res.status(500).send({
         message:
            err.message || "Some error occured while retrieving Booking Centers."
        });
        else res.send(data);
    });
};

//@desc Get all hotels
//@route Get /api/v1/hotels
//@access Public
exports.getHotels=async(req,res,next)=>{
    let query;

    //Copy req.query
    const reqQuery={...req.query};

    //Fields to exclude
    const removeFields=['select','sort','page','limit'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr=JSON.stringify(req.query);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`);

    //finding resource
    query=Hotel.find(JSON.parse(queryStr)).populate('bookings').populate('rooms');

    //Select Fields
    if(req.query.select) {
        const  fields=req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if(req.query.sort) {
            const SortBy=req.query.sort.split(',').join(' ');
            query = query.sort(SortBy);
        } else {
            query = query.sort('-createdAt')
        }
    //Pagination
    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;

    try{
        const total = await Hotel.countDocuments();
        query=query.skip(startIndex).limit(limit);
        //Execute query
        const hotels = await query;
        
        //Pagination result
        const pagination={};

        if(endIndex<total){
            pagination.next={
            page:page+1,
            limit
            }
        }

        if(startIndex>0){
            pagination.prev={
            page:page-1,
            limit
            }
        }

        res.status(200).json({success:true,count:hotels.length,pagination,data:hotels});
    } catch(err) {
        res.status(400).json({success:false});
    //res.status(200).json({success:true, msg:'Get all hotels'});
    }

};

//@desc Get single hotel
//@route Get /api/v1/hotels/:id
//@access Public
exports.getHotel=async(req,res,next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id).populate('bookings').populate('rooms');

        if(!hotel) {
            return res.status(400).json({success:false});
        }
        
        res.status(200).json({success:true, data:hotel});
    } catch(err) {
        res.status(400).json({success:false});
    }
};

//@desc Create a hotel
//@route POST /api/v1/hotel
//@access Private
exports.createHotel=async (req,res,next)=>{
    const hotel =  await Hotel.create(req.body);
    res.status(201).json({success:true, data:hotel});
}

//@desc update a hotel
//@route PUT /api/v1/hotel/:id
//@access Private
exports.updateHotel=async(req,res,next)=>{
    try{
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });

        if(!hotel){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:hotel});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc delete a hotel
//@route DELETE /api/v1/hotel/:id
//@access Private
exports.deleteHotel=async (req,res,next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);

        if(!hotel){
            return res.status(400).json({success:false});
        }

        await hotel.deleteOne();
        res.status(200).json({success:true, data: {}});
    }catch(err){
    res.status(400).json({success:false});
    }
    
};
