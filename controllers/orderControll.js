const users = require('../models/userModel');
const cart = require('../models/cartModel')
const address = require('../models/userDetailsModel')
const order = require('../models/orderModel');
const crypto = require('crypto');
const products = require('../models/productModel');
const orderModel = require('../models/orderModel');
const paypal = require('paypal-rest-sdk');
const coupon = require('../models/couponModel');
const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY, RETURN_URL, CANCEL_URL } = process.env;


//////////paypal configuration /////////////

paypal.configure({
    'mode': PAYPAL_MODE,
    'client_id': PAYPAL_CLIENT_KEY,
    'client_secret': PAYPAL_SECRET_KEY
});



const laodCheckout = async (req, res) => {
    try {
        const userid = req.session.user._id
        const cartProducts = await cart.findOne({ user: userid }).populate('products.productID').populate('user');
        const user = await users.findById(req.session.user._id);
        const totalcart = []
        cartProducts.products.forEach(product => {
            totalcart.push(product.total)
        });

        const subtotal = totalcart.reduce((sum, value) => sum + value, 0);

        const coupons = await coupon.aggregate([
            {
                $match: {
                    minimumSpend: { $lte: subtotal },
                    isActive: true,
                    validFrom: { $lte: new Date() },
                    validTo: { $gte: new Date() }
                }
            },
            {
                $sort: { minimumSpend: -1 }
            },
            {
                $limit: 1
            }
        ]);

        // Check if coupons array is not empty
        if (coupons.length > 0) {
            const [{ couponCode, couponName }] = coupons;
            if (req.query.id) {
                const userid = req.query.id
                const Address = await address.findById({ _id: userid })
                res.render('checkout', { cartProducts, subtotal, Address, user, couponCode, couponName })
            } else {
                const Address = await address.findOne({ user: req.session.user._id })
                res.render('checkout', { cartProducts, subtotal, Address, user, couponCode, couponName })
            }
        } else {

            if (req.query.id) {
                const userid = req.query.id
                const Address = await address.findById({ _id: userid })
                res.render('checkout', { cartProducts, subtotal, Address, user })
            } else {
                const Address = await address.findOne({ user: req.session.user._id })
                res.render('checkout', { cartProducts, subtotal, Address, user })
            }
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).render('error')

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
        res.status(500).render('error')

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
        res.status(500).render('error')

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
        res.status(500).render('error')

    }
};



const placeOrder = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { shippingID, paymentMethod, totalamount, subtotal, status } = req.body
        req.session.user.totalAmount = totalamount
        req.session.shippingID = shippingID;
        req.session.user.status = status
        req.session.user.subtotal = subtotal
        /////////////////// finding ordered products from the cart ///////////
        const findCart = await cart.findOne({ user: userId }).populate('products.productID')
        const cartProducts = findCart.products.map(products => {
            return products
        })
    
        ////////////////////////////////// total amount of cart ////////////

        const totalCart = findCart.products.map(product => product.total);
        // const totalamount = totalCart.reduce((sum, value) => sum = sum + value);


        const isCouponApplied = req.session.IsCouponApplied;
        const couponcode = req.session.couponCode;
        if (isCouponApplied) {
            const couponUpdate = await coupon.findOneAndUpdate({ couponCode: couponcode }, {
                $push: {
                    userUsers: req.session.user._id
                }
            })
        }






        //// if payment method if cash on delivery////////

        if (paymentMethod == 'cod') {

            ///////////////////////////////// generate trackid ////////////////

            const trackID = crypto.randomBytes(8).toString('hex');


            ///////////////  saving the order details  /////////////////////// 

            /////////////////// reducing quantity of the ordered items ///////////////////
            let updated
            for (const item of findCart.products) {
                const productid = item.productID;
                const quantity = item.quantity;
                const updateStock = await products.findOne({ _id: productid });
                if (updateStock.stock <= 0) {
                    return res.status(200).json({ message: 'out of stock ', value: 2 });
                }
                updateStock.stock -= quantity;
                updated = await updateStock.save()
            }

            const placeorder = new order({
                customerID: userId,
                shippingAddress: shippingID,
                items: cartProducts.map(products => {
                    return {
                        productID: products.productID,
                        productPrize: products.productID.Prize,
                        quantity: products.quantity,
                        orderStatus: 'ordered',
                        returnOrderStatus: {
                            status: 'none',
                            reason: 'none'
                        }
                    }
                }),
                orderStatus: 'ordered',
                statusLevel: 1,
                totalAmount: totalamount,
                paymentMethod: paymentMethod,
                trackID: trackID
            });
            let saving
            if (updated) {
                saving = await placeorder.save();
            }
            if (saving) {


                if (status) {
                    const finduser = await users.findById(userId);
                    const history = {
                        type: 'debit',
                        amount: subtotal,
                        reason: 'purchased product'
                    }
                    finduser.wallet.walletAmount -= Math.max(subtotal, 0);
                    finduser.wallet.walletHistory.push(history);
                    await finduser.save()
                }

                const deleteCart = await cart.deleteOne({ user: userId });

                res.status(200).json({ message: 'order has been placed suucefully', value: 0 })
            } else {
                res.status(200).json({ message: 'failed to place the order', value: 404 });
            }


            //// if payment method is paypal ////////

        } else if (paymentMethod == 'netbanking') {

            const findCart = await cart.findOne({ user: userId }).populate('products.productID')

            for (const item of findCart.products) {
                const productid = item.productID;
                const updateStock = await products.findOne({ _id: productid });
                if (updateStock.stock <= 0) {
                    return res.status(200).json({ message: 'out of stock ', value: 2 });
                }
            }

            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": RETURN_URL,
                    "cancel_url": CANCEL_URL
                },
                "transactions": [{
                    // "item_list": {
                    //     "items": findCart.products.map(product => ({
                    //         "name": product.productID.productName,
                    //         "sku": "001",
                    //         "price": product.productID.Prize,
                    //         "currency": "USD",
                    //         "quantity": product.quantity
                    //     }))
                    // },
                    "amount": {
                        "currency": "USD",
                        "total": totalamount == 0 ? totalamount + 1 : totalamount
                    },
                    "description": "Products in the cart"
                }]
            };


            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    // Handle the payment response
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            // Redirect to the approval URL
                            res.status(200).json({
                                message: 'Order has been placed successfully',
                                value: 1,
                                link: payment.links[i].href
                            });
                        }
                    }
                }
            });


        }

    } catch (error) {
        console.log(error.message);
        res.status(500).render('error')

    }
}






const placeOrderInPaypal = async (req, res) => {
    try {

        const userId = req.session.user._id;
        /////////////////// finding ordered products from the cart ///////////
        const findCart = await cart.findOne({ user: userId }).populate('products.productID')
        const cartProducts = findCart.products.map(products => {
            return products
        })
        ////////////////////////////////// total amount of cart ////////////
        const totalCart = findCart.products.map(product => product.total);
        const totalamount = req.session.user.totalAmount
        const status = req.session.user.status;
        const subtotal = req.session.user.subtotal;

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;


        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": totalamount == 0 ? totalamount + 1 : totalamount
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                const shippingID = req.session.shippingID

                ///////////////////////////////// generate trackid ////////////////

                const trackID = crypto.randomBytes(8).toString('hex');


                ///////////////  saving the order details  /////////////////////// 


                const placeorder = new order({
                    customerID: userId,
                    shippingAddress: shippingID,
                    items: cartProducts.map(products => {
                        return {
                            productID: products.productID,
                            productPrize: products.productID.Prize,
                            quantity: products.quantity,
                            orderStatus: 'ordered',
                            returnOrderStatus: {
                                status: 'none',
                                reason: 'none'
                            }
                        }
                    }),
                    orderStatus: 'ordered',
                    statusLevel: 1,
                    totalAmount: totalamount,
                    paymentMethod: 'Net Banking',
                    trackID: trackID
                });
                const saving = await placeorder.save();
                if (saving) {

                    /////////////////// reducing quantity of the ordered items ///////////////////

                    for (const item of findCart.products) {
                        const productid = item.productID;
                        const quantity = item.quantity;
                        const updateStock = await products.findOne({ _id: productid });
                        if (updateStock.stock <= 0) {
                            return res.status(200).json({ message: 'out of stock ', value: 2 });
                        }
                        updateStock.stock -= quantity;
                        updateStock.save()
                    }

                    if (status) {
                        const findUser = await users.findById(userId);
                       console.log(subtotal);
                        const amountToDeduct = Math.max(subtotal, 0);
                        console.log(amountToDeduct);
                    
                        const history = {
                            type: 'debit',
                            amount: amountToDeduct,
                            reason: 'purchased product'
                        };
                    
                        findUser.wallet.walletAmount -= amountToDeduct;
                        findUser.wallet.walletHistory.push(history);
                    
                        await findUser.save();
                    }
                    

                    const deleteCart = await cart.deleteOne({ user: userId });

                    res.redirect('/order-placed')
                } else {
                    res.status(200).json({ message: 'failed to place the order', value: 1 });
                }


            }
        });


    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }
}





const loadPage = async (req, res) => {
    try {
        res.render('order-placed')

    } catch (error) {

        console.log(error);
        res.status(500).render('error')

    }
}


const cancelOrder = async (req, res) => {
    try {
        const orderID = req.body.orderId
        const update = await order.findOneAndUpdate(
            { 'items._id': orderID },
            { $set: { 'items.$.orderStatus': 'canceled' } },
            { new: true }
        ).populate('items.productID');



        if (update) {

            if (update.paymentMethod == 'Net Banking') {



                const canceledProduct = update.items.map((products) => {
                    return products.productID
                })
                const productPrize = canceledProduct.map((product) => {
                    return product.Prize
                })
                const Prize = productPrize[0]
                const findUser = await users.findById(req.session.user._id);
                const wallethistory = {
                    type: 'credit',
                    amount: Prize,
                    reason: 'cancel refund'
                }

                findUser.wallet.walletAmount = findUser.wallet.walletAmount + parseInt(Prize);
                findUser.wallet.walletHistory.push(wallethistory);
                await findUser.save();

            }

            res.status(200).json({ message: 'canceled product ' });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).render('error')

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
        res.status(500).render('error')

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
        res.status(500).render('error')

    }
}







const changeStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        const changeStatus = await orderModel.findOneAndUpdate({ _id: orderId }, {
            $set: {
                orderStatus: status,
                updatedAt: Date.now()
            }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).render('error')

    }
}


const renderCancelPage = async (req, res) => {
    try {
        res.render('cancelpage');

    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }
}


const returnOrder = async (req, res) => {
    try {
        const { orderid, productID, reason, prize } = req.body;
        const Order = await order.findOne({ 'items._id': orderid })
        const paymentmethod = Order.paymentMethod;
        const product = Order.items.find((product) => {
            return product.productID == productID
        })
        product.returnOrderStatus.status = 'returned';
        product.returnOrderStatus.reason = reason;
        const returnSaved = await Order.save();

        if (returnSaved) {

            if (paymentmethod == 'Net Banking') {
                const findUser = await users.findById(req.session.user._id);
                const wallethistory = {
                    type: 'credit',
                    amount: prize,
                    reason: 'return refund'
                }

                findUser.wallet.walletAmount = findUser.wallet.walletAmount + parseInt(prize);
                findUser.wallet.walletHistory.push(wallethistory);
                await findUser.save();
            }

            res.status(200).json({ message: 'returned' });
        }

    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }
}



const loadWalletPage = async (req, res) => {
    try {
        const findWallet = await users.findById(req.session.user._id);
        res.render('wallet', { walletdata: findWallet });
    } catch (error) {
        console.log(error.message);
        res.status(500).render('error')

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
    changeStatus,
    placeOrderInPaypal,
    renderCancelPage,
    returnOrder,
    loadWalletPage,

}