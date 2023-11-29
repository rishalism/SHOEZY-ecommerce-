const express= require('express');
const path = require('path')
const userRoute=express();
userRoute.set('views','./views/users');
const usercontrol= require('../controllers/userControll')



userRoute.get('/',usercontrol.loadHome);
userRoute.get('/register',usercontrol.usersignupLoad);
userRoute.get('/home',usercontrol.loadHome)
userRoute.post('/register',usercontrol.insertUser);
userRoute.get('/login',usercontrol.loginloaduser)
userRoute.post('/login',usercontrol.verifyUser)
userRoute.get('/otpverification',usercontrol.otpLoad)
userRoute.post('/otpverification',usercontrol.verifyOtp)
userRoute.get('/shop',usercontrol.loadShop)
userRoute.get('/about',usercontrol.loadAboutUs)
userRoute.get('/contact-us',usercontrol.loadContact)
userRoute.get('/product-detail',usercontrol.loadProductDetails)




module.exports=userRoute
