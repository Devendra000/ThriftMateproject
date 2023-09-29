const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirm:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
    },
    address:{
        type:String,
    },
    image:{
        type:Object,
        default:'',
    },
    buyerCart:[
        {productCost:{type: Number},
        productQuantity:{type: Number},
        seller:{type: String},
        productName:{type: String}}
        ],
    boughtProduct:[{
        productName:String,
        productCost:Number,
        productQuantity:Number,
        seller:String,
    }],
    createdDate:{
        type:Date,
        default: Date.now(),
    },

    is_verified:{
        type:Number,
        default:0,
    },
    is_admin:{
        type:Number,
        default:0,
    },
    token:{
        type:String,
        default:''
    }
});

const buyer = mongoose.model('BUYER',userSchema);

module.exports = buyer;