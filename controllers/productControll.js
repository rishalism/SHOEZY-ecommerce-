const products = require('../models/productModel');
const categories = require('../models/categoriesModel');
const productModel = require('../models/productModel');

const loadProducts = async (req, res) => {
    try {
        const product = await products.find().populate('category')
        res.render('products', { product });
    } catch (error) {
        console.log(error.message);
        res.status(500).render('error')

    }
};


const LoadAddProducts = async (req, res) => {
    try {
        const category = await categories.find({ is_listed: 0 })
        res.render('add-product', { category })
    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }
}






const addProducts = async (req, res) => {
    try {
        const { name: productName, description, price: Prize, category: category, size, stock } = req.body

        const existingproduct = await products.findOne({
            productName: { $regex: new RegExp(`^${productName}$`, 'i') }
        });

        if (existingproduct) {
            const category = await categories.find({ is_listed: 0 })
            res.render('add-product', { message: 'This product name already exists.  !' ,category});
        } else {
            const image = req.files.map((file) => file.filename);
            const addNewProduct = await new products({
                productName,
                image,
                description,
                Prize,
                size,
                stock,
                category,
                is_listed: 0
            })
            const saving = await addNewProduct.save();
            if (saving) {
                res.redirect('/admin/products')
            }
        }

    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }
}





const LoadEditProduct = async (req, res) => {

    try {
        const id = req.params.id
        const product = await products.findById({ _id: id })
        const category = await categories.find({ is_listed: 0 })
        res.render('edit-products', { product, category });

    } catch (error) {
        console.log(error.message);
        res.status(500).render('error')

    }

}




const editProduct = async (req, res) => {
    try {
        const product = req.body.productId
        const { name: productName, description, price: Prize, category: category, size, stock } = req.body
        const image = req.files.map((file) => file.filename);
        const update = await products.findByIdAndUpdate(
            { _id: product },
            {
                $set: {
                    productName,
                    description,
                    Prize,
                    category,
                    size,
                    stock
                },
                $push: {
                    image: { $each: image } // Assuming 'image' is the new image object
                }
            },
            { new: true }
        );

        const data = update.save();
        if (data) {
            res.redirect('/admin/products');
        }
    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }
}



const deleteImage = async (req, res) => {
    try {
        const product = req.body.productID
        const imageName = req.body.imageName;
        const findproduct = await products.findByIdAndUpdate({ _id: product }, { $pull: { image: imageName } })
        if (findproduct) {
            res.json({ message: 'image is succesfully deleted' })
        }

    } catch (error) {

        console.log(error);
        res.status(500).render('error')

    }
}




const unlistProduct = async (req, res) => {
    try {
        const productid = req.body.productid
        const findProduct = await products.findById({ _id: productid });
        findProduct.is_listed = true;
        const data = await findProduct.save()
        if (data) {
            res.json({ message: 'succesfull' })
        }
    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }
}





const listProduct = async (req, res) => {
    try {
        const productid = req.body.productid
        const findProduct = await products.findById({ _id: productid })
        findProduct.is_listed = false
        const saving = await findProduct.save()
        if (saving) {
            res.json({ message: 'listed succesfully' })
        } else {
            res.json({ message: 'operation failed' })
        }

    } catch (error) {

        console.log(error.message);
        res.status(500).render('error')

    }

}

module.exports = {
    loadProducts,
    LoadAddProducts,
    addProducts,
    LoadEditProduct,
    editProduct,
    unlistProduct,
    listProduct,
    deleteImage
}