const users = require('../models/userModel');
const cart = require('../models/cartModel')
const address = require('../models/userDetailsModel')
const order = require('../models/orderModel');
const crypto = require('crypto');
const products = require('../models/productModel');
const orderModel = require('../models/orderModel');


const laodCheckout = async (req, res) => {
    try {
        const userid = req.session.user._id
        const cartProducts = await cart.findOne({ user: userid }).populate('products.productID').populate('user');
        const totalcart = []
        cartProducts.products.forEach(product => {
            totalcart.push(product.total)
        });
        const subtotal = totalcart.reduce((sum, value) => sum = sum + value);

        if (req.query.id) {
            const userid = req.query.id
            const Address = await address.findById({ _id: userid })
            res.render('checkout', { cartProducts, subtotal, Address })
        } else {
            const Address = await address.findOne({ user: req.session.user._id })
            res.render('checkout', { cartProducts, subtotal, Address })
        }

    } catch (error) {

        console.log(error.message);
    }
}





const LoadUserOrders = async (req, res) => {
    try {
        const id = req.session.user._id
        const userOrder = await order.findOne({ customerID: id });
        if (userOrder) {
            const orderedProducts = await order.find({ customerID: id })
                .populate('items.productID')
            res.render('orderedProducts', { orderedProducts, userOrder })
        } else {
            res.render('orderedProducts')

        }

    } catch (error) {
        console.log(error.message);
    }
}



const loadOrders = async (req, res) => {
    try {
        const findorders = await order.find();
        if (findorders) {
            res.render('order', { orders: findorders })
        } else {
            res.render('order');
        }

    } catch (error) {
        console.log(error.message);
    }
}


const loadOrderDetails = async (req, res) => {
    try {
        const id = req.query.id;
        const userid = req.session.user._id;
        const username = await users.findOne({ _id: userid });
        const name = username.firstName;
        const orderedProducts = await order.findOne({ _id: id })
            .populate({
                path: 'items.productID',
                model: 'products'
            });

        if (orderedProducts) {
            const totalAmount = orderedProducts.totalAmount;
            res.render('orderDetails', { name, orderedProducts, totalAmount });
        } else {
            res.render('orderDetails', { name });
        }
    } catch (error) {
        console.error(error.message);
    }
};



const placeOrder = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const shippingID = req.body.address;
        const paymentMethod = req.body.paymentMethod;

        /////////////////// finding ordered products from the cart ///////////
        const findCart = await cart.findOne({ user: userId })
        const cartProducts = findCart.products.map(products => {
            return products
        })

        ////////////////////////////////// total amount of cart ////////////

        const totalCart = findCart.products.map(product => product.total);
        const totalamount = totalCart.reduce((sum, value) => sum = sum + value);

        ///////////////////////////////// generate trackid ////////////////

        const trackID = crypto.randomBytes(8).toString('hex');


        ///////////////  saving the order details  /////////////////////// 


        const placeorder = new order({
            customerID: userId,
            shippingAddress: shippingID,
            items: cartProducts.map(products => {
                return {
                    productID: products.productID,
                    quantity: products.quantity,
                    orderStatus: 'ordered'
                }
            }),
            orderStatus: 'ordered',
            statusLevel: 1,
            totalAmount: totalamount,
            paymentMethod: paymentMethod,
            trackID: trackID
        });

        const saving = await placeorder.save();
        if (saving) {

            /////////////////// reducing quantity of the ordered items ///////////////////

            for (const item of findCart.products) {
                const productid = item.productID;
                const quantity = item.quantity;
                const updateStock = await products.findOne({ _id: productid });
                updateStock.stock -= quantity;
                updateStock.save()
            }

            const deleteCart = await cart.deleteOne({ user: userId });

            res.status(200).json({ message: 'order has been placed suucefully', value: 0 })
        } else {
            res.status(200).json({ message: 'failed to place the order', value: 1 });
        }

    } catch (error) {
        console.log(error.message);
    }
}



const loadPage = async (req, res) => {
    try {
        res.render('order-placed')

    } catch (error) {

        console.log(error);
    }
}


const cancelOrder = async (req, res) => {
    try {
        const orderID = req.body.orderId

        const update = await order.findOneAndUpdate(
            { 'items._id': orderID },
            { $set: { 'items.$.orderStatus': 'canceled' } },
            { new: true }
        );

        if (update) {
            res.status(200).json({ message: 'canceled product ' });
        }

    } catch (error) {
        console.log(error.message);
    }
}





const adminCancelOrder = async (req, res) => {
    try {
        const orderID = req.body.orderId;
        const cancelOrder = await order.findOneAndUpdate({ 'items._id': orderID }, { $set: { 'items.$.orderStatus': 'canceled' } });
        if (cancelOrder) {
            res.status(200).json({ message: 'order canceled succesfully' });
        }


    } catch (error) {

        console.log(error.message);
    }
}



const loadManageOrder = async (req, res) => {

    try {
        const id = req.query.id;
        const orderedProducts = await order.findOne({ _id: id })
            .populate({
                path: 'items.productID',
                model: 'products'
            });

        const totalAmount = orderedProducts.totalAmount;
        res.render('adminOrderDetails', { orderedProducts, totalAmount });
    } catch (error) {

        console.log(error.message);
    }
}







const changeStatus = async (req, res) => {
    try {
        const { orderId , status } = req.body

        const changeStatus = await orderModel.findOneAndUpdate({_id : orderId},{
            $set : {
                orderStatus : status,
                updatedAt : Date.now()
            }
        });

        console.log(changeStatus);
        
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    loadOrders,
    laodCheckout,
    placeOrder,
    loadPage,
    loadOrderDetails,
    LoadUserOrders,
    cancelOrder,
    loadManageOrder,
    adminCancelOrder,
    changeStatus
}