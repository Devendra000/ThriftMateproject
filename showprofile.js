const dotenv = require('dotenv');

const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,'./public');
app.use(express.static(static_path));

app.listen(port, ()=>{
   console.log(`Server runs at port ${port}`);
});

//database connection
const connectdb = ()=>{
    require('./src/db/conn');
 }
 connectdb();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//buyer route
const buyerRoute = require('./router/buyerUpdateRoute');
app.use('/', buyerRoute);

//seller route
const sellerRoute = require('./router/sellerRoute');
app.use('/seller', sellerRoute);

//admin route
const adminRoute = require('./router/adminRoute');
app.use('/admin', adminRoute)