const admincontrol= require('../controllers/adminControll')
const customerControll = require('../controllers/customercontroll');
const productControll = require('../controllers/productControll')
const orderControll =require('../controllers/orderControll')
const categoriesControll = require('../controllers/categoriesControll')
const adminAuth = require('../middlewares/adminAuth')
const upload = require('../middlewares/multer');
const express= require('express');
const path = require('path')
const adminRoute=express();
adminRoute.set('views','./views/admin');
adminRoute.use(express.urlencoded({ extended: true }));



adminRoute.get('/',adminAuth.isLoggedOut,admincontrol.adminLoginLoad);
adminRoute.post('/',admincontrol.verifyAdmin)
adminRoute.get('/logout',admincontrol.logout)
adminRoute.get('/dashboard',adminAuth.isLoggedIn,admincontrol.loadDashboard)
adminRoute.get('/users',adminAuth.isLoggedIn,customerControll.loadUsers);
adminRoute.get('/products',adminAuth.isLoggedIn,productControll.loadProducts);
adminRoute.get('/orders',adminAuth.isLoggedIn,orderControll.loadOrders)
adminRoute.get('/categories',adminAuth.isLoggedIn,categoriesControll.loadCategories)
adminRoute.post('/add-category',categoriesControll.addCategories)
adminRoute.post('/list-category',categoriesControll.listCategory)
adminRoute.post('/unlist-category',categoriesControll.UnlistCategory)
adminRoute.get('/edit-category',categoriesControll.LoadCategory)
adminRoute.post('/edit-category',categoriesControll.editCategory)
adminRoute.post('/block-user',admincontrol.blockUser)
adminRoute.post('/unblock-user',admincontrol.unBlockUser)
adminRoute.get('/add-products',productControll.LoadAddProducts)
adminRoute.post('/add-product',upload.array('images',3),productControll.addProducts)
adminRoute.get('/edit-product/:id',productControll.LoadEditProduct)
adminRoute.post('/edit-product',upload.array('images',3),productControll.editProduct)
adminRoute.post('/edit-delete-product',productControll.deleteImage)
adminRoute.post('/unlist-product',productControll.unlistProduct)
adminRoute.post('/list-product',productControll.listProduct);


module.exports=adminRoute