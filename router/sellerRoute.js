const express = require('express');
const sellerRoute = express();
const ejs = require('ejs');
const path = require('path');
const view = path.join(__dirname,'../views/seller');
sellerRoute.set('view engine','ejs');
sellerRoute.set('views', view);
const multer = require('multer');

const auth = require('../middleware/sellerAuth');

const bodyParser = require('body-parser');
sellerRoute.use(bodyParser.json());
sellerRoute.use(bodyParser.urlencoded({ extended: true }));

const session = require('express-session');
const cookieParser = require('cookie-parser');

const config = require('../config/config');
const sellerController = require('../controller/sellerController');

sellerRoute.use(session({secret:config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    }));

    const storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,path.join(__dirname,'../public/sellerImages'));
        }, 
        filename: function(req,file,cb){
            const name = Date.now()+'_'+file.originalname;
            cb(null,name);
        }
    })

    const multiStorage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,path.join(__dirname,'../public/productImages'));
        }, 
        filename: function(req,file,cb){
            const name = Date.now()+'_'+file.originalname;
            cb(null,name);
        }
    })
    
    const upload = multer({storage:storage})
    const uploadMulti = multer({storage:multiStorage});


sellerRoute.get('/', auth.isLoggedOut, (req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
});

sellerRoute.get('/login', auth.isLoggedOut, sellerController.home);
sellerRoute.post('/', sellerController.getLogIn)

sellerRoute.get('/signup', auth.isLoggedOut, sellerController.loadSignUp);
sellerRoute.post('/signup',upload.single("image"), sellerController.getSignUp)

sellerRoute.get('/home', auth.isLoggedIn, sellerController.loadProfile);

sellerRoute.get('/complete', auth.isLoggedIn, sellerController.loadUpdate)
sellerRoute.post('/complete', upload.single("image"), sellerController.updateProfile)

sellerRoute.get('/product', auth.isLoggedIn, sellerController.loadProduct);
sellerRoute.post('/product', sellerController.getProduct)

sellerRoute.get('/listProducts', auth.isLoggedIn, sellerController.listProduct);

sellerRoute.get('/review', auth.isLoggedIn, sellerController.review)

sellerRoute.get('/success', auth.isLoggedIn, (req,res)=>{
    res.render('success');
})

sellerRoute.get('/soldProducts', auth.isLoggedIn, sellerController.soldProduct)

sellerRoute.get('/logout',auth.isLoggedIn, sellerController.logOut);

module.exports = sellerRoute;