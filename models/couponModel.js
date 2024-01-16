const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({

    couponCode: {
        type: String,
        require: true,
        unique: true
    },
    couponName: {
        type: String,
    },
    discountAmount: {
        type: Number,
        require: true
    },
    minimumSpend: {
        type: Number,
        require: true
    },
    validFrom: {
        type: Date,
        require: true
    },
    validTo: {
        type: Date,
        require: true
    },
    isActive: {
        type: Boolean,
        require: true
    },
    usageLimit: {
        type: Number,
        require: true
    },
    userUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
})

module.exports = mongoose.model('coupon',couponSchema);