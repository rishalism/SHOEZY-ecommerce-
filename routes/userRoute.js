const express = require('express');
const path = require('path')
const userRoute = express();
userRoute.set('views', './views/users');
const usercontrol = require('../controllers/userControll')
const cartControll = require('../controllers/cartControll');
const orderControll = require('../controllers/orderControll')
const coupenControll = require('../controllers/couponControll')
const auth = require('../middlewares/userAuth')


///// register ////
userRoute.get('/', auth.isLoggedOut, usercontrol.loadHome);
userRoute.get('/register', auth.isLoggedOut, usercontrol.usersignupLoad);
userRoute.post('/register', usercontrol.insertUser);


///// login ////
userRoute.get('/login', auth.isLoggedOut, usercontrol.loginloaduser)
userRoute.post('/login', usercontrol.verifyUser)
userRoute.get('/logout', usercontrol.logOut)
userRoute.get('/otpverification', auth.isLoggedIn, usercontrol.otpLoad)
userRoute.post('/otpverification', usercontrol.verifyOtp)
userRoute.post('/resend-otp', usercontrol.resendOtp)
userRoute.post('/resend-forgtotOTP', usercontrol.resendforgotPasswordOtp)



//// shoping ////
userRoute.get('/home', auth.isLoggedIn, usercontrol.loadHome)
userRoute.get('/shop', auth.isLoggedIn, usercontrol.loadShop)
userRoute.get('/about', auth.isLoggedIn, usercontrol.loadAboutUs)
userRoute.get('/contact-us', auth.isLoggedIn, usercontrol.loadContact)
userRoute.get('/product-detail', auth.isLoggedIn, usercontrol.loadProductDetails)


//// cart  and wishlist related ////
userRoute.get('/check-cart', auth.isLoggedIn, cartControll.checkCart)
userRoute.get('/check-wishlist', auth.isLoggedIn, cartControll.checkCart)
userRoute.get('/product-cart', auth.isLoggedIn, cartControll.loadCart)
userRoute.get('/wishlist', auth.isLoggedIn,cartControll.Loadwishlist)
userRoute.post('/wishlist',cartControll.addToWishlist)
userRoute.post('/product-cart', cartControll.addToCart)
userRoute.post('/remove-product', cartControll.removeProduct)
userRoute.post('/quantity-updation', cartControll.updateQuantity)
userRoute.post('/quantity-decrement', cartControll.decrementQuantity)

////// order related /////
userRoute.get('/checkout', auth.isLoggedIn, orderControll.laodCheckout);
userRoute.post('/checkout', auth.isLoggedIn, coupenControll.applyDiscount);
userRoute.post('/place-order', orderControll.placeOrder)
userRoute.get('/order-placed', auth.isLoggedIn, orderControll.loadPage)
userRoute.get('/blocked', auth.isLoggedIn, usercontrol.loadBLock)
userRoute.get('/order',auth.isLoggedIn,orderControll.LoadUserOrders)
userRoute.get('/order-details',auth.isLoggedIn,orderControll.loadOrderDetails)
userRoute.post('/cancel-order', auth.isLoggedIn, orderControll.cancelOrder)
userRoute.get('/success', auth.isLoggedIn, orderControll.placeOrderInPaypal)
userRoute.get('/cancel', auth.isLoggedIn, orderControll.renderCancelPage);

///// user account and features  ////////
userRoute.get('/user-account', auth.isLoggedIn, usercontrol.loadProfile)
userRoute.post('/user-account', usercontrol.saveUser)
userRoute.get('/add-address', auth.isLoggedIn, usercontrol.loadEdditUserAddress)
userRoute.post('/add-address', usercontrol.editAddress)
userRoute.post('/change-password',usercontrol.changePassword);
userRoute.post('/update-password',usercontrol.updatePassword)
userRoute.post('/edit-profile',usercontrol.editProfile)
userRoute.get('/forgot-password',usercontrol.LoadforgotPassword)
userRoute.post('/forgot-password',usercontrol.checkEmail)
userRoute.get('/password-otp',usercontrol.LoadforgotPasswordOtp)
userRoute.post('/password-otp',usercontrol.verifyPasswordOtp)
userRoute.post('/reset-password',usercontrol.resetPassword)
userRoute.post('/return-order',orderControll.returnOrder)
userRoute.get('/wallet',orderControll.loadWalletPage)
userRoute.post('/check-coupon',coupenControll.verifyCoupon)

///////////// invoice download ///////////

userRoute.post('/getInvoiceData',coupenControll.fetchInvoiceData)

module.exports = userRoute
