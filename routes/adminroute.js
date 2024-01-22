const admincontrol= require('../controllers/adminControll')
const customerControll = require('../controllers/customerControll');
const productControll = require('../controllers/productControll')
const orderControll =require('../controllers/orderControll')
const categoriesControll = require('../controllers/categoriesControll')
const couponControll = require('../controllers/couponControll')
const adminAuth = require('../middlewares/adminAuth')
const upload = require('../middlewares/multer');
const express= require('express');
const path = require('path')
const adminRoute=express();
adminRoute.set('views','./views/admin');
adminRoute.use(express.urlencoded({ extended: true }));



adminRoute.get('/',adminAuth.isLoggedOut,admincontrol.adminLoginLoad)
adminRoute.post('/',admincontrol.verifyAdmin)
adminRoute.get('/logout',admincontrol.logout)
adminRoute.get('/dashboard',adminAuth.isLoggedIn,admincontrol.loadDashboard)
adminRoute.get('/users',adminAuth.isLoggedIn,customerControll.loadUsers);
adminRoute.get('/products',adminAuth.isLoggedIn,productControll.loadProducts);
adminRoute.get('/orders',adminAuth.isLoggedIn,orderControll.loadOrders)
adminRoute.get('/categories',adminAuth.isLoggedIn,categoriesControll.loadCategories)
adminRoute.post('/add-category',adminAuth.isLoggedIn,categoriesControll.addCategories)
adminRoute.post('/list-category',adminAuth.isLoggedIn,categoriesControll.listCategory)
adminRoute.post('/unlist-category',adminAuth.isLoggedIn,categoriesControll.UnlistCategory)
adminRoute.get('/edit-category',adminAuth.isLoggedIn,categoriesControll.LoadCategory)
adminRoute.post('/edit-category',adminAuth.isLoggedIn,categoriesControll.editCategory)
adminRoute.post('/block-user',adminAuth.isLoggedIn,admincontrol.blockUser)
adminRoute.post('/unblock-user',adminAuth.isLoggedIn,admincontrol.unBlockUser)
adminRoute.get('/add-products',adminAuth.isLoggedIn,productControll.LoadAddProducts)
adminRoute.post('/add-product',adminAuth.isLoggedIn,upload.array('images',3),productControll.addProducts)
adminRoute.get('/edit-product/:id',adminAuth.isLoggedIn,productControll.LoadEditProduct)
adminRoute.post('/edit-product',adminAuth.isLoggedIn,upload.array('images',3),productControll.editProduct)
adminRoute.post('/edit-delete-product',adminAuth.isLoggedIn,productControll.deleteImage)
adminRoute.post('/unlist-product',adminAuth.isLoggedIn,productControll.unlistProduct)
adminRoute.post('/list-product',adminAuth.isLoggedIn,productControll.listProduct);
adminRoute.get('/manage-prodcuts',adminAuth.isLoggedIn,orderControll.loadManageOrder)
adminRoute.post('/cancel-order',adminAuth.isLoggedIn,orderControll.adminCancelOrder)
adminRoute.post('/change-status',adminAuth.isLoggedIn,orderControll.changeStatus)
adminRoute.get('/coupon',adminAuth.isLoggedIn,couponControll.LoadCouponPage)
adminRoute.post('/coupon',adminAuth.isLoggedIn,couponControll.Update)
adminRoute.get('/add-coupon',adminAuth.isLoggedIn,couponControll.LoadAddCouponPage)
adminRoute.post('/add-coupon',adminAuth.isLoggedIn,couponControll.addcoupon)
adminRoute.get('/edit-coupon/:id',adminAuth.isLoggedIn,couponControll.LoadEditCoupon)
adminRoute.post('/edit-coupon',adminAuth.isLoggedIn,couponControll.editCoupon)
adminRoute.post('/dashboard',adminAuth.isLoggedIn,admincontrol.salesData)
adminRoute.get('/salesReport',adminAuth.isLoggedIn,admincontrol.LoadSalesReport)
adminRoute.post('/getSalesData',adminAuth.isLoggedIn,admincontrol.getSalesData)



module.exports=adminRoute