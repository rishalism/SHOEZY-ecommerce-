const users = require('../models/userModel');




const loadOrders = async (req,res)=>{
    try {
        res.render('order')

    } catch (error) {
        
        console.log(error.message);
    }
}





module.exports={
    loadOrders
}