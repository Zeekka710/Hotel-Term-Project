const mongoose = require('mongoose');
const CodeSchema = new mongoose.Schema({
    code:{
        type:String,
        required:[true,'Please add a code'],
    },
    description: {
        type:String,
        required:[true,'Please add a description'],
    },
});

module.exports=mongoose.model('DiscountCode',CodeSchema);