const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
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
    address:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        default:''
    },
    createdDate:{
        type:Date,
        default: Date.now(),
    },
    review:{
        type:String,
        default:''
    },
    is_verified:{
        type:Number,
        default:0,
    },
    
    is_admin:{
        type:Number,
        default:0,
    }

});

const seller = mongoose.model('SELLER',userSchema);

module.exports = seller;