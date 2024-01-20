const users = require('../models/userModel');



const loadUsers = async (req,res)=>{
    try {
        const customersData= await users.find({is_admin:0});
        res.render('users', {customer : customersData});
    } catch (error) {
        res.status(500).render('error')
        console.log(error.message);
    }
}




module.exports={
    loadUsers
}