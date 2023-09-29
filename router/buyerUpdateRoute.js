const express = require('express');
const buyerRoute = express();
const path = require('path');
const multer = require('multer');
const view = path.join(__dirname,'../views/buyer');
const ejs = require('ejs');
buyerRoute.set('view engine','ejs');
buyerRoute.set('views', view);
const session = require('express-session');
const cookieParser = require('cookie-parser');
const config = require('../config/config');
const buyerUpdateController = require('../controller/buyerController');

const bodyParser = require('body-parser');
buyerRoute.use(bodyParser.json());
buyerRoute.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/buyerImages'));
    }, 
    filename: function(req,file,cb){
        const name = Date.now()+'_'+file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage:storage});

buyerRoute.use(session({secret:config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    }));

const auth = require('../middleware/auth');

buyerRoute.get('/', auth.isLoggedOut, buyerUpdateController.startPage);

buyerRoute.get('/login', auth.isLoggedOut, buyerUpdateController.startPage);
buyerRoute.post('/login', buyerUpdateController.loginBuyer);

buyerRoute.get('/signup', auth.isLoggedOut, buyerUpdateController.startPage);
buyerRoute.post('/signup',buyerUpdateController.signupBuyer);

buyerRoute.get('/forgot', auth.isLoggedOut , buyerUpdateController.startPage);
buyerRoute.post('/forgot',buyerUpdateController.forgotPassword);

buyerRoute.get('/verifyEmail', auth.isLoggedOut, buyerUpdateController.verify);
buyerRoute.post('/verifyEmail', buyerUpdateController.sendVerifyM)

buyerRoute.get('/verify', buyerUpdateController.verifyMail);

buyerRoute.get('/complete', auth.isLoggedIn, buyerUpdateController.toProfile);
buyerRoute.post('/complete',upload.single("image"), buyerUpdateController.updateProfile);

buyerRoute.get('/forgot-password', auth.isLoggedOut, buyerUpdateController.changePasswordLoad);
buyerRoute.post('/forgot-password', auth.isLoggedOut, buyerUpdateController.changePassword);

buyerRoute.get('/homepage', auth.isLoggedIn, buyerUpdateController.home);

buyerRoute.get('/browseProducts', auth.isLoggedIn, buyerUpdateController.browseProducts);

buyerRoute.get('/myCart', auth.isLoggedIn, buyerUpdateController.myCart);

buyerRoute.get('/addToCart', auth.isLoggedIn, buyerUpdateController.addToCart);

buyerRoute.get('/logout', auth.isLoggedIn, buyerUpdateController.logOut);

module.exports = buyerRoute;