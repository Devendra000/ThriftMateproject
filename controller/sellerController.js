const seller = require('../src/models/sellerModel');
const product = require('../src/models/productModel');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');
const bodyParser = require('body-parser');

const home = async(req,res)=>{
    try {
        res.redirect('/seller/')
    } catch (error) {
        console.log(error.message)
    }
}

const loadLogIn = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const loadSignUp = async(req,res)=>{
    try {
        res.render('signup')
    } catch (error) {
        console.log(error.message);
    }
}

const getLogIn = async(req,res)=>{
    try {
       const {email, password} = req.body;
       const userData = await seller.findOne({email:email});
       if(userData){
            if(password === userData.password){
                req.session.email = userData.email;
                res.redirect('/seller/home');
            }
            else{
                res.render ('login',{message:`Invalid credentials ${req.body.email}`})
            }
        }
        else{
            res.render('login',{message:`Invalid credentials ${req.body.email}`})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const getSignUp = async(req,res)=>{
    try {
        const {name, phone, email, password, confirm, address} = req.body;
        const image = req.file;
        const userData = await seller.findOne({email:email});
        if(userData){
            res.render('signup',{message:`Email already exists ${req.body.email}`})
        }
        else{
            const newSeller = await new seller({name, phone, email, password, confirm, address, image});
            newSeller.save();
            if(newSeller){
                res.redirect('/seller')
            }
            else{
                res.render('login',{message:'Registration failed. Could not save'})
            }

        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadProfile = async(req,res)=>{
    try {
        const userData = await seller.findOne({email: req.session.email});
        res.render('home',{user:userData});

    } catch (error) {
        console.log(error.message)
    }
}

const loadUpdate = async(req,res)=>{
    try {
        const userData = await seller.findOne({email: req.session.email});
        res.render('edit',{user:userData});
    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async(req,res)=>{
    const id=req.query.id;
    const userData = await seller.findOne({_id:id});
    console.log(id)
    console.log(userData.id)
    console.log(userData.image.filename)
    if(userData){
        const {name, address, phone} = req.body;
        const image = req.file;
            if(image){
            const updated = await seller.findByIdAndUpdate({_id:id},{name:name, address:address, phone:phone, image:image});
                if(updated){
                    console.log('updated seller with pic')
                        res.redirect('/seller/login')
                }
                else{
                    console.log('could not update seller')
                    res.redirect('/seller/login');
                }
            }
            else{
            const updated = await seller.findByIdAndUpdate({_id:id},{name:name, address:address, phone:phone});
                if(updated){
                    console.log('updated seller without pic')
                        res.redirect('/seller/login')
                }
                else{
                    console.log('could not update seller without pic')
                    res.redirect('/seller/login');
                }
            }
    }
}
const loadProduct = async(req,res)=>{
    res.render('upload');
}


const getProduct = async(req,res)=>{
    
    try {
        console.log(req.session.email)
        const email= req.session.email;
        const {name,price,category,condition} = req.body;
        const images = req.file;
        const newProduct = await new product({name,price,category,condition,images,uploader:email});
            newProduct.save();
        if(newProduct){
            console.log(newProduct.name)
            res.redirect('/seller/success');
            console.log('User found')
        }    
        else{
            console.log('could not save the product')
        }
    }
    catch(error){
        console.log(error.message)
    }
}

const listProduct = async(req,res)=>{
    try {
        const email = req.session.email;
        const listProduct = await product.find({uploader:email});
        console.log("list"+email);
        res.render('listProducts',{product:listProduct})    

    } catch (error) {
        console.log(error.message)
    }
}

const soldProduct = async(req,res)=>{
        const email = req.session.email;
        const listProduct = await product.find({uploader:email});
        console.log("sold "+email);
        res.render('soldProducts',{product:listProduct})
}

const review = async(req,res)=>{
    const productData = await product.find({uploader:req.session.email})
    res.render('review',{product:productData});
}


const logOut = async(req,res)=>{
    try {
        console.log(`session about to be destroyed is of ${req.session.email}`);
        req.session.destroy();
        res.redirect('/seller');
        console.log('logout from seller');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    logOut,
    loadLogIn,
    loadSignUp,
    getLogIn,
    getSignUp,
    home,
    loadProfile,
    loadUpdate,
    updateProfile,
    loadProduct,
    getProduct,
    listProduct,
    review,
    soldProduct
}