const admincontrol= require('../controllers/adminControll')
const customerControll = require('../controllers/customercontroll');
const productControll = require('../controllers/productControll')
const orderControll =require('../controllers/orderControll')
const categoriesControll = require('../controllers/categoriesControll')
const upload = require('../middlewares/multer');
const express= require('express');
const path = require('path')
const adminRoute=express();
adminRoute.set('views','./views/admin');
adminRoute.use(express.urlencoded({ extended: true }));



adminRoute.get('/',admincontrol.adminLoginLoad);
adminRoute.post('/',admincontrol.verifyAdmin)
adminRoute.get('/dashboard',admincontrol.loadDashboard)
adminRoute.get('/users',customerControll.loadUsers);
adminRoute.get('/products',productControll.loadProducts);
adminRoute.get('/orders',orderControll.loadOrders)
adminRoute.get('/categories',categoriesControll.loadCategories)
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
adminRoute.post('/unlist-product',productControll.unlistProduct)
adminRoute.post('/list-product',productControll.listProduct);


module.exports=adminRoute