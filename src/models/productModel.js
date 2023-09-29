const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    condition:{
        type:String,
        required:true,
    },
    images: {
        type:[String],
        default:''
    },
    uploader:{
        type:String,
        required:true,
    },
    uploadedAt:{
        type:Date,
        default:Date.now()
    },
    sold:{
        type:Number,
        default:0
    },
    review:{
        type:String,
        default:''
    },
    stars:{
        type:Number,
        default:0.0,
    },
    isVerified:{
        type:Number,
        default:0
    }
});

const product = mongoose.model('PRODUCT',userSchema);

module.exports = product;