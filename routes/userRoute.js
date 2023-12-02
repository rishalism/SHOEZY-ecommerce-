const express= require('express');
const path = require('path')
const userRoute=express();
userRoute.set('views','./views/users');
const usercontrol= require('../controllers/userControll')
const cartControll = require('../controllers/cartControll');
const auth  = require('../middlewares/userAuth')


userRoute.get('/',usercontrol.loadHome);
userRoute.get('/register',usercontrol.usersignupLoad);
userRoute.get('/home',usercontrol.loadHome)
userRoute.post('/register',usercontrol.insertUser);
userRoute.get('/login',auth.notLogin,usercontrol.loginloaduser)
userRoute.post('/login',usercontrol.verifyUser)
userRoute.get('/logout',usercontrol.logOut)
userRoute.get('/otpverification',usercontrol.otpLoad)
userRoute.post('/otpverification',usercontrol.verifyOtp)
userRoute.get('/shop',usercontrol.loadShop)
userRoute.get('/about',usercontrol.loadAboutUs)
userRoute.get('/contact-us',usercontrol.loadContact)
userRoute.get('/product-detail',usercontrol.loadProductDetails)
userRoute.get('/product-cart',cartControll.loadCart)
userRoute.post('/product-cart',cartControll.addToCart)


module.exports=userRoute
