const admin = require('../src/models/adminModel');
const seller = require('../src/models/sellerModel');
const product = require('../src/models/productModel');
const buyer = require('../src/models/buyerUpdateModel');

const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');
const bodyParser = require('body-parser');

const loadLogIn = async(req,res)=>{
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message);
    }
}

const getLogIn = async(req,res)=>{
    try {
       const {email, password} = req.body;
       const userData = await admin.findOne({email:email});
       if(userData){
        console.log(userData.is_admin)
            if(userData.is_admin===1){
                if(password === userData.password){
                    req.session.email = userData.email;
                    res.redirect('/admin/home');
                }
                else{
                    res.render ('home',{message:`Invalid credentials ${req.body.email}`});
                }
            }
            else{
                res.render('home',{message:`Invalid credentials ${req.body.email}`})
            }
        }
        else{
            res.render('home',{message:`Invalid credentials ${req.body.email}`})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadProfile = async(req,res)=>{
    try {
        const userData = await admin.findOne({email: req.session.email});
        res.render('homepage',{user:userData});

    } catch (error) {
        console.log(error.message)
    }
}

const home = async(req,res)=>{
    try {
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}

const viewBuyers = async(req,res)=>{
    const buyerData = await buyer.find({is_admin:0});
    res.render('viewBuyers',{buyer:buyerData})
}

const viewSellers = async(req,res)=>{
    const sellerData = await seller.find({is_admin:0});
    res.render('viewSellers',{seller:sellerData})
}

const verifyProducts = async(req,res)=>{
    const productData = await product.find({isVerified:0});
    console.log(productData)
    res.render('verifyProducts',{product:productData});
}

const acceptProduct = async(req,res)=>{
    const id = req.query.id;
    const updateProduct =  await product.findByIdAndUpdate({_id:id},{isVerified:1})
    if(updateProduct){
        console.log('accepted')
        res.redirect('/admin/verifyProducts');
    }
}

const rejectProduct = async(req,res)=>{
    const id = req.query.id;
    const updateProduct =  await product.findByIdAndRemove({_id:id})
    if(updateProduct){
        console.log('rejected')
        res.redirect('/admin/verifyProducts');
    }
}


const logOut = async(req,res)=>{
    try {
        console.log(`session about to be destroyed is of ${req.session.email}`);
        req.session.destroy();
        res.redirect('/admin');
        console.log('logout from admin')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogIn,
    getLogIn,
    loadProfile,
    home,
    viewBuyers,
    viewSellers,
    verifyProducts,
    acceptProduct,
    rejectProduct,
    logOut
}