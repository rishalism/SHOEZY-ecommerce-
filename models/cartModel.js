const mongoose = require('mongoose')


const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    products: [
        {
            productID: {
                type: mongoose.Schema.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
                max: 10
            },
            total: {
                type: Number,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }, updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})


module.exports=mongoose.model('cart',cartSchema)