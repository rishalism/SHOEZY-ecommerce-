const express= require('express');
const path = require('path')
const userRoute=express();
userRoute.set('views','./views/users');
const usercontrol= require('../controllers/userControll')
const cartControll = require('../controllers/cartControll');
const orderControll = require('../controllers/orderControll')
const auth  = require('../middlewares/userAuth')

userRoute.get('/',auth.isLoggedOut,usercontrol.loadHome);
userRoute.get('/register',auth.isLoggedOut,usercontrol.usersignupLoad);
userRoute.post('/register',usercontrol.insertUser);
userRoute.get('/login',auth.isLoggedOut,usercontrol.loginloaduser)
userRoute.post('/login',usercontrol.verifyUser)
userRoute.get('/logout',usercontrol.logOut)
userRoute.get('/otpverification',usercontrol.otpLoad)
userRoute.post('/otpverification',usercontrol.verifyOtp)
userRoute.post('/resend-otp',usercontrol.resendOtp)
userRoute.get('/home',auth.isLoggedIn,usercontrol.loadHome)
userRoute.get('/shop',auth.isLoggedIn,usercontrol.loadShop)
userRoute.get('/about',auth.isLoggedIn,usercontrol.loadAboutUs)
userRoute.get('/contact-us',auth.isLoggedIn,usercontrol.loadContact)
userRoute.get('/product-detail',auth.isLoggedIn,usercontrol.loadProductDetails)
userRoute.get('/check-cart',auth.isLoggedIn,cartControll.checkCart)
userRoute.get('/product-cart',auth.isLoggedIn,cartControll.loadCart)
userRoute.post('/product-cart',cartControll.addToCart)
userRoute.post('/remove-product',cartControll.removeProduct)
userRoute.post('/quantity-updation',cartControll.updateQuantity)
userRoute.post('/quantity-decrement',cartControll.decrementQuantity)
userRoute.get('/checkout',auth.isLoggedIn,orderControll.laodCheckout);
userRoute.get('/user-account',auth.isLoggedIn,usercontrol.loadProfile)
userRoute.post('/user-account',usercontrol.saveUser)
userRoute.get('/add-address',auth.isLoggedIn,usercontrol.loadEdditUserAddress)
userRoute.post('/add-address',usercontrol.editAddress)
userRoute.post('/place-order',orderControll.placeOrder)
userRoute.get('/order-placed',auth.isLoggedIn,orderControll.loadPage)
userRoute.get('/blocked',usercontrol.loadBLock)

module.exports=userRoute
