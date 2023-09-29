const buyer = require('../src/models/buyerUpdateModel');
const seller = require('../src/models/sellerModel');
const product = require('../src/models/productModel');
const cart = require('../src/models/cart');

const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');
const express = require('express');

const startPage = async(req,res)=>{
    productData = await product.find({isVerified:1})
    console.log(productData)
    if(productData)
        {res.render('home',{product:productData});}
    else{
        res.render('home',{message:''})
    }
}

const toProfile = async(req,res)=>{
    const id = req.query.id;
    const userData = await buyer.findOne({_id:id});
    if(userData){
        res.render('edit',{user:userData})
    }
    else{
        res.redirect('homepage')
        console.log('cant update')
    }}

const updateProfile =  async(req, res) => {
    const id=req.query.id;
    const userData = await buyer.findOne({_id:id});
    console.log(id)
    if(userData){
        const {name, address, phone}= req.body;
        const image = req.file;

            if(image){
                const userUpdate = await buyer.updateOne({_id:id},{$set:{name:name, image:image, address:address, phone:phone}});
                
                if(userUpdate){
                    res.redirect('homepage');
                    console.log(`updated  with image and name is ${image}`)
                }
                else{
                    console.log('could not update')
                    res.redirect('homepage');
                }
            }

            else{
                const userUpdate = await buyer.updateOne({_id:id},{ $set:{name:name, address:address, phone:phone} });
                if(userUpdate){
                    res.redirect('homepage');
                    console.log(`updated without image`)
                }
                else{
                    console.log('could not update')
                    res.redirect('homepage');
                }
            }
    }
    else{
            console.log(`that's not the user i'm looking for`)
    }
}

const home = async(req,res)=>{
    console.log(req.session.email);
    const userData = await buyer.findOne({email: req.session.email})
    if(userData){
        res.render('profile',{user:userData});
    }
    else{
        console.log('not found')
    }
    

    }

const logOut = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
        console.log('logout from buyer')
    } catch (error) {
        console.log(error.message);
    }
}

//to send verification mail
const sendVerifyMail = (name,email,id)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: config.userMail,
                pass: config.userPass
            },
            secure:false,
            requireTLS:true,
            });

        const details = {
            from: '"Thrift Mate" <wearethriftmate@gmail.com>',
            to:email,
            subject:'Verify Your Email Address with Thriftmate',
            html: `<p> Hi ${name}. \nClick here to <a href = 'http://localhost:3000/verify?id=${id}'> verify </a> your mail.</p>`
        }

        transporter.sendMail(details,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log('Email sent')
            }
        })

    } catch (error) {
        console.log(error.message);
    }

}

//for user verification
const verifyMail = async(req,res)=>{
    try {
        const verified = await buyer.updateOne({_id:req.query.id},{$set:{is_verified:1}});
        console.log('User verified')
        res.render('emailVerified')
    } catch (error) {
        console.log(error.message)
    }
}

const verify = async(req,res)=>{
    try {
        res.render('./verify');
    } catch (error) {
        console.log(error.message)
    }
}


//for sending mail to reset password

const sendResetMail = (name,email,token)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: config.userMail,
                pass: config.userPass
            },
            secure:false,
            requireTLS:true,
            });

        const details = {
            from: `"Thrift Mate" <${config.userMail}>`,
            to:email,
            subject:'Password Reset',
            html: `<p> Hi ${name}. \nClick on the link to reset your password. 'http://localhost:3000/forgot-password?token=${token}'</p>`
        }

        transporter.sendMail(details,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log('Email sent')
            }
        })

    } catch (error) {
        console.log(error.message);
    }

}


//for getting password
const changePasswordLoad = async(req,res)=>{
    try {
        const token = req.query.token;
        const buyerExist = await buyer.findOne({token:token});
        if(buyerExist){
            res.render('forgot',{id : buyerExist._id});
        }
        else{
            res.render('404',{message:'Token Invalid'});
        }

    } catch (error) {
        console.log(error.message);
    }
}

//for changing password
const changePassword = async(req,res)=>{
    try {
        const id = req.body.id;
        const newPass = req.body.password; 
        console.log(id);
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const spassword= await bcrypt.hash(newPass, salt);
        
        const updatedData = await buyer.findByIdAndUpdate({_id:id}, {$set : {password:spassword, token:''}});
        if(updatedData){
            console.log(`password changed to ${spassword} for id ${id} and now the token is ${updatedData.token}`)
            res.render('home',{message:'Password Changed', product:productData})
        }
    } catch (error) {
        console.log(error.message);
    }
}

const signupBuyer = async(req,res)=>{

    try {
        const {name, email, password, confirm, userType} = req.body;

        const productData = await product.find({isVerified:1}) 

        //hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const spassword= await bcrypt.hash(password, salt);
        const sconfirm= await bcrypt.hash(confirm, salt);

    buyerExist = buyer.findOne({email:email}).then((buyerExist)=>{
        if(buyerExist){
            res.render('home',{message:'Username already taken', product:productData});
                console.log('Username already taken. Database not updated');
            }
        else{
                const buyerUpdate = new buyer({name, email, password:spassword, confirm:sconfirm, userType});
                
                //send email for verification
                sendVerifyMail(name,email, buyerUpdate._id);

                buyerUpdate.save();
                if(buyerUpdate){
                    
                    res.render('home',{message:'User registered. Verify Email', product:productData});
                }
                else{
                    res.render('home',{message:'Registration failed. Could not save', product:productData})
                }
        }})
    } catch (error) {
        console.log(error.message);
    }};
        
    const loginBuyer = async (req,res)=>{
        const productData = await product.find({isVerified:1})
        const {email, password} = req.body;
        buyerExist = await buyer.findOne({email:email});

        if(buyerExist){
            const passMatch = await bcrypt.compare(password, buyerExist.password);
            
            if(passMatch){
                if(buyerExist.is_verified==1){
                    req.session.email = buyerExist.email;
                    console.log(`session name is ${req.session.email} and buyer name is ${buyerExist.email}`)
                    res.redirect('/homepage');
                }
                else{
                    res.render('home',{message:`You're not verified`, product:productData});
                }
            }
            else{
                res.render('home',{message:'Invalid credentials', product:productData});
            }
        }
        else{
            res.render('home',{message:'Invalid credentials', product:productData});
        }
    };

    const forgotPassword = async(req,res)=>{

        try{
            const productData = await product.find({isVerified:1})
            const email = req.body.email;
            const userData = await buyer.findOne({email:email});
            if(userData){
                if(userData.is_verified === 0){
                    res.render('home',{message:'Email is not verified', product:productData});
                }
                else{
                    const randomString = randomstring.generate();
                    const updatedData = await buyer.updateOne({email:email},{token:randomString});
                    sendResetMail(userData.name,email,randomString);
                    res.render('home', {message:'Email sent for password reset', product:productData});
                
                }
            }

        }
        catch(e){
                console.log(e);
            }
        }

        const sendVerifyM = async(req,res)=>{
            try {
                const productData = await product.find({isVerified:1})
                const email = req.body.email;
                const userData = await buyer.findOne({email:email});
                if(userData){
                    if(userData.is_verified === 1){
                        res.render('home', {message:'You are already verified', product:productData})
                    }
                    else{
                        sendVerifyMail(userData.name,email, userData._id);
                        res.render('home', {message:'Check email to verify your mail', product:productData});
                
                    }
                }
                else{
                    res.render('home', {message:`Email doesn't exist`, product:productData});
                
                }

            } catch (error) {
                console.log(error.message)
            }
        }

        const browseProducts = async(req,res)=>{
            try {
                const email = req.session.email;
                const productData = await product.find({isVerified:1})
                res.render('productList',{product:productData})
            } catch (error) {
                console.log(error.message);
            }
        }

        const myCart = async(req,res)=>{
            console.log('mycart'+req.session.email)
            const user = await buyer.findOne({email:req.session.email});
            const buyerCart = await cart.find({email:req.session.email});
            console.log(buyerCart);
            res.render('cart',{cart:buyerCart});
        }

        const addToCart = async(req,res)=>{
            const id = req.query.id;
            const productData =  await product.findOne({_id:id});
            const name = productData.name;
            const cost =  productData.price;
            let quantity = 1;
            const seller =  productData.uploader;

            const findProducts = await cart.find({id:productData._id});
            console.log(findProducts)
            const q = findProducts.quantity;
            if(findProducts.length > 0){
                quantity = quantity+1;
                const cartUpdate = await cart.findOneAndUpdate({id:req.query.id},{quantity:quantity})
            }

            else{
                const cartUpdate = await new cart({email: req.session.email, id:id, name:name, cost:cost, seller:seller});
                const saveCart = cartUpdate.save();
            }
            
            const buyerCart = await cart.find({email:req.session.email})
            res.render('cart',{cart:buyerCart})
        }

    module.exports = {
        signupBuyer,
        loginBuyer,
        forgotPassword,
        verifyMail,
        verify,
        sendVerifyM,
        startPage,
        toProfile,
        home,
        changePasswordLoad,
        changePassword,
        logOut, 
        updateProfile, 
        myCart,
        browseProducts,
        addToCart,
    }