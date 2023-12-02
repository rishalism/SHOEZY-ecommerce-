const cart = require('../models/cartModel');




const loadCart = async (req,res)=>{
    try {
        const cartProducts = await cart.findOne().populate('products.productID').populate('user');
        const cartDetails = cartProducts.products
        res.render('shopping-cart',{cartProducts,cartDetails})
    } catch (error) {
        console.log(error.message);
    }
}




const addToCart = async (req, res) => {
    try {
        const userData = req.session.user;
        const productID = req.body.productId;
        const userID = userData._id;
        // check if the user exist or not

        const newCart = new cart({
            user: userID, 
            products: [{
                productID: productID,
            }]
        });

        const savedCart = await newCart.save();

        if (savedCart) {
            console.log('Successfully added to cart');
            res.status(200).json({ message: 'Successfully added to cart' });
        } else {
            console.log('Failed to add to cart');
            res.status(500).json({ error: 'Failed to add to cart' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports={
    loadCart,
    addToCart
}