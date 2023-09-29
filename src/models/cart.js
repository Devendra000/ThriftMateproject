const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    email:
        {type: String,
        required:true},

    id:
        {type: String,
        required:true},

    name:
        {type: String,
        required:true}, 

    cost:
        {type: Number,
        required:true},    
    
    quantity:
        {type: Number,
            default:1,
        required:true},    
    
    seller:
        {type: String,
        required:true}

});

const cart = mongoose.model('CART',cartSchema);

module.exports = cart;