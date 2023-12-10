const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
    },
    state: {
        type: String,
        required: true,
    },
    town: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    houseName: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    zipcode: {
        type: String, 
        required: true,
    },
});



module.exports = mongoose.model('address', AddressSchema)

