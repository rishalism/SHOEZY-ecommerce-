require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const nocache = require('nocache');
const path = require('path')
mongoose.connect('mongodb://127.0.0.1:27017/shoezy');//conecting mongo db database in //// 
const session = require('express-session');
const config = require('./config/config')
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(nocache());

app.use(session({
  secret: config.generateRandomString(32),
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRoute = require('./routes/userRoute')
app.use('/', userRoute);


const adminroute = require('./routes/adminroute')
app.use('/admin', adminroute)

////creating a port to the server /////

app.listen(3000, () => {
  console.log('server is runnig ');
})


