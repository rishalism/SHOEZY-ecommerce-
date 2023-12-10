const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    },
    items: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            orderStatus: {
                type: String,
                required: true
            },
            returnOrderStatus: {
                status: {
                    type: String
                },
                reason: {
                    type: String
                },
                date: {
                    type: Date
                }
            }
        }
    ],
    orderStatus: {
        type: String,
        required: true
    },
    statusLevel: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        // required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    coupon: {
        type: String
    },
    trackID: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('order',orderSchema);
