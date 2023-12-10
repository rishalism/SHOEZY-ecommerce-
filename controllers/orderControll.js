const users = require('../models/userModel');
const cart = require('../models/cartModel')
const address = require('../models/userDetailsModel')
const order = require('../models/orderModel');
const crypto = require('crypto');


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






const loadOrders = async (req, res) => {
    try {
        const findorders = await order.find();
        res.render('order',{orders : findorders})

    } catch (error) {

        console.log(error.message);
    }
}




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
        if(saving){
            const deleteCart = await cart.deleteOne({user : userId});
            res.status(200).json({message : 'order has been placed suucefully' , value : 0})
        }else {
            res.status(200).json({message : 'failed to place the order',value : 1});
        }

    } catch (error) {
        console.log(error.message);
    }
}



const loadPage = async (req,res)=>{
    try {
        res.render('order-placed')

    } catch (error) {
        
        console.log(error);
    }
}



module.exports = {
    loadOrders,
    laodCheckout,
    placeOrder,
    loadPage
}