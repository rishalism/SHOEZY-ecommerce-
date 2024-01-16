const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    userId : {
          type : mongoose.Types.ObjectId,
          ref : 'users',
          required : true,
    },
    wishlistProducts : [
        {
            type : mongoose.Types.ObjectId,
             ref : 'products',
             required : true
        }
    ]
})


module.exports = mongoose.model('wishlist',wishlistSchema);