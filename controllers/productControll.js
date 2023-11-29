const products = require('../models/productModel');
const categories = require('../models/categoriesModel');


const loadProducts = async (req, res) => {
    try {
        const product = await products.find().populate('category');
        res.render('products', { product });
    } catch (error) {
        console.log(error.message);
    }
};


const LoadAddProducts = async (req, res) => {
    try {
        const category = await categories.find({is_listed : 0})
        res.render('add-product', { category })
    } catch (error) {

        console.log(error.message);
    }
}


const addProducts = async (req, res) => {
    try {
        const { name: productName, description, price: Prize, category: category, size, stock } = req.body
        console.log(req.body);
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

    } catch (error) {

        console.log(error.message);
    }
}





const LoadEditProduct = async (req, res) => {
    
        try {
            const id = req.params.id
            const product = await products.findById({ _id: id })
            const category = await categories.find({is_listed : 0})
            res.render('edit-products', { product, category });

        } catch (error) {
            console.log(error.message);
        }
    
}




const editProduct = async (req, res) => {
    try {
const product = req.body.productId
const { name: productName, description, price: Prize, category: category, size, stock } = req.body
const image = req.files.map((file) => file.filename);

const update = await products.findByIdAndUpdate({_id : product},{
    $set : {
        productName ,
        image,
        description,
        Prize,
        category,
        size,
        stock
    }
} )

const data = await update.save();
if(data){
    res.redirect('/admin/products');
}
    } catch (error) {

        console.log(error.message);
    }
}








const unlistProduct = async (req, res) => {
    try {
        const productid = req.body.productid
        const findProduct = await products.findById({ _id: productid });
        findProduct.is_listed = true;
        const data = await findProduct.save()
        if(data){
            res.json({message : 'succesfull'})
        }
    } catch (error) {

        console.log(error.message);
    }
}


const listProduct  = async (req,res)=>{

try {
    const productid = req.body.productid
    const findProduct = await products.findById({_id : productid})
    findProduct.is_listed = false
    const saving = await findProduct.save()
    if(saving){
        res.json({message : 'listed succesfully'})
    }else{
        res.json({message: 'operation failed'})
    }

} catch (error) {
    
    console.log(error.message);
}

}

module.exports = {
    loadProducts,
    LoadAddProducts,
    addProducts,
    LoadEditProduct,
    editProduct,
    unlistProduct,
    listProduct
}