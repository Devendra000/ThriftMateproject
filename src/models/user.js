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
    userType:{
        type: String,
    },
    image:{
        type:String,
        default:'Profile picture',
    },
    createdDate:{
        type:Date,
        default: Date.now(),
    },

    is_verified:{
        type:Number,
        default:0,
    },
    is_admin:{
        type:Boolean,
        default:false,
    }

});

const user = mongoose.model('BUYER',userSchema);

module.exports = user;