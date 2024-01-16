const { get } = require('mongoose');
const coupon = require('../models/couponModel');
const orderModel = require('../models/orderModel');
const users = require('../models/userModel')

const LoadCouponPage = async (req, res) => {
    try {
        const coupons = await coupon.find();
        res.render('coupon', { coupons })
    } catch (error) {

        console.log(error.message);
    }
}



const LoadAddCouponPage = async (req, res) => {
    try {
        res.render('add-coupon')
    } catch (error) {

        console.log(error.message);
    }

}

const addcoupon = async (req, res) => {
    try {
        const { couponCode, couponName, discountAmount, minimumSpend, validFrom, validTo, usageLimit } = req.body

        const newCoupon = new coupon({
            couponCode,
            couponName,
            discountAmount,
            minimumSpend,
            validFrom,
            validTo,
            isActive: true,
            usageLimit,
        })
        const added = await newCoupon.save();
        if (added) {
            res.redirect('/admin/coupon');
        }

    } catch (error) {

        console.log(error.message);
    }
}

const Update = async (req, res) => {
    try {
        const { isActive, id } = req.body
        const update = await coupon.findByIdAndUpdate({ _id: id }, {
            $set: {
                isActive: isActive
            }
        })
        if (update) {
            res.status(200).json({ message: 'updated' })
        }
    } catch (error) {

        console.log(error.message);
    }
}



const applyDiscount = async (req, res) => {
    try {
        const { status, subtotal } = req.body

        if (status == true) {
            total = parseInt(subtotal) - walletAmount
            total = Math.max(total, 0);

        } else {

        }

    } catch (error) {

        console.log(error.message);
    }
}


const verifyCoupon = async (req, res) => {
    try {
        const { couponCode, couponApplied } = req.body
        const findcoupon = await coupon.findOne({ couponCode: couponCode });
        const iscouponUsed = findcoupon.userUsers.find((element) => {
            if (element == req.session.user._id) {
                return true
            }
            return false
        })

        if (iscouponUsed) {
            res.status(200).json({ status: 400 });
        }
        else if (findcoupon) {
            req.session.IsCouponApplied = couponApplied;
            req.session.couponCode = couponCode
            const discountAmount = findcoupon.discountAmount
            res.status(200).json({ status: 200, discountAmount });
        } else {
            res.status(200).json({ status: 404 })
        }
    } catch (error) {

    }
}



const fetchInvoiceData = async (req, res) => {
    try {

        const { orderid } = req.body
        const getORderData = await orderModel.findById(orderid).populate('shippingAddress').populate('customerID');
        const shippingAddress = getORderData.shippingAddress
        const userAddres  = getORderData.customerID
        const orderdate  = getORderData.orderDate
        res.status(200).json({shippingAddress,userAddres,orderdate})
    } catch (error) {

        console.log(error.message);
    }
}



module.exports = {
    LoadCouponPage,
    LoadAddCouponPage,
    addcoupon,
    Update,
    applyDiscount,
    verifyCoupon,
    fetchInvoiceData
}