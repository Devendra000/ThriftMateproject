const express = require('express');
const adminRoute = express();
const path = require('path');
const multer = require('multer');
const view = path.join(__dirname,'../views/admin');
const ejs = require('ejs');
adminRoute.set('view engine','ejs');
adminRoute.set('views', view);

const session = require('express-session');
const cookieParser = require('cookie-parser');
const config = require('../config/config');
const adminController = require('../controller/adminController');

const bodyParser = require('body-parser');
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));

const auth = require('../middleware/adminAuth');

adminRoute.get('/', auth.isLoggedOut, adminController.loadLogIn);

adminRoute.get('/login', auth.isLoggedOut, adminController.home);
adminRoute.post('/', adminController.getLogIn)

adminRoute.get('/home', auth.isLoggedIn, adminController.loadProfile);

adminRoute.get('/buyersPage', auth.isLoggedIn, adminController.viewBuyers);

adminRoute.get('/sellersPage', auth.isLoggedIn, adminController.viewSellers);

adminRoute.get('/verifyProducts', auth.isLoggedIn, adminController.verifyProducts);

adminRoute.get('/accept', auth.isLoggedIn, adminController.acceptProduct);

adminRoute.get('/reject', auth.isLoggedIn, adminController.rejectProduct);

adminRoute.get('/logout',auth.isLoggedIn, adminController.logOut);


module.exports = adminRoute;