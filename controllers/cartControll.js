const cart = require('../models/cartModel');
const productModel = require('../models/productModel');



const checkCart = async (req, res) => {
    try {
        if (req.session.user) {
            res.status(200).json({ message: 'user is there ', value: 1 });
        } else {
            res.status(200).json({ message: 'please login ', value: 2 });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal Server Error', value: 0 });
    }
}



const loadCart = async (req, res) => {
    try {
        if (req.session.user) {
            const userId = req.session.user._id;
            const cartProducts = await cart.findOne({ user: userId }).populate('products.productID').populate('user');

            if (cartProducts && cartProducts.products.length > 0) {
                const totalCart = cartProducts.products.map(product => product.total);
                const subtotal = totalCart.reduce((sum, value) => sum + value, 0);

                res.render('shopping-cart', { cartProducts, subtotal });
            } else {
                // Render 'shopping-cart' without cart products
                res.render('shopping-cart');
            }
        } else {
            res.redirect('/register');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};




const addToCart = async (req, res) => {
    try {
        const userData = req.session.user;
        const productID = req.body.productId;
        const prize = req.body.prize;
        console.log(prize);
        const userID = userData._id;

        try {
            // Check if the user has a cart
            const userCart = await cart.findOne({ user: userID });

            if (userCart) {
                // Check if the product already exists in the cart
                const checkProduct = userCart.products.find(item => item.productID.equals(productID));

                if (checkProduct) {
                    console.log('Product already exists');
                    res.status(200).json({ success: false, message: 'Product already exists in the cart', value: 1 });
                } else {
                    // Add the new product to the existing cart if the product does not exist
                    const newProduct = {
                        productID: productID,
                        quantity: 1,
                        total: prize
                    };

                    userCart.products.push(newProduct);
                    const updatedCart = await userCart.save();

                    if (updatedCart) {
                        console.log('Successfully added to cart');
                        res.status(200).json({ success: true, message: 'Successfully added to cart', value: 2 });
                    } else {
                        console.log('Failed to add to cart');
                        res.status(500).json({ success: false, error: 'Failed to add to cart', value: 3 });
                    }
                }
            } else {
                // If the user doesn't have a cart, create a new one
                const newCart = new cart({
                    user: userID,
                    products: [{
                        productID: productID,
                        quantity: 1,
                        total: prize
                    }]
                });

                const savedCart = await newCart.save();

                if (savedCart) {
                    console.log('Successfully added to cart');
                    res.status(200).json({ success: true, message: 'Successfully added to cart', value: 2 });
                } else {
                    console.log('Failed to add to cart');
                    res.status(500).json({ success: false, error: 'Failed to add to cart', value: 3 });
                }
            }
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ success: false, error: 'Internal server error', value: 3 });
        }


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error', value: 4 });
    }
};



const removeProduct = async (req, res) => {
    try {
        const productId = req.body.productID
        const userID = req.session.user._id

        const findcart = await cart.findOneAndUpdate({ user: userID }, {
            $pull: {
                products: { productID: productId }
            }
        })

        if (findcart) {
            res.status(200).json({ message: 'succefully removed from cart' })
        }
    } catch (error) {

        console.log(error.message);
    }
}




const updateQuantity = async (req, res) => {

    try {
        const productID = req.body.productId
        const total = req.body.total;
        const currentQuantity = req.body.currentQuantity + 1
        const user = req.session.user._id;
        const result = await cart.updateOne(
            { user, "products.productID": productID },
            { $set: { "products.$.quantity": currentQuantity, "products.$.total": total } }
        );
        if (result) {
            res.status(200).json({ message: 'updated succesfully'})
        }
    } catch (error) {

        console.log(error.message);
    }
}




const decrementQuantity = async (req, res) => {

    try {
        const productID = req.body.productId
        const total = req.body.total
        const currentQuantity = req.body.currentQuantity - 1
        const user = req.session.user._id;
        const result = await cart.updateOne(
            { user, "products.productID": productID },
            { $set: { "products.$.quantity": currentQuantity, "products.$.total": total } }
        );
        if (result) {
            res.status(200).json({ message: 'updated succesfully' })
        }

    } catch (error) {

        console.log(error.message);
    }
}



module.exports = {
    loadCart,
    addToCart,
    removeProduct,
    checkCart,
    updateQuantity,
    decrementQuantity
}