const users = require('../models/userModel');
const bcrypt = require('bcrypt');



const securepassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}


const adminLoginLoad= async (req,res)=>{
    try {
        res.render('adminLogin')

    } catch (error) {
        console.log(error.message);
    }
}




const verifyAdmin = async (req, res) => {
    try {
          
        const {email,password} = req.body
        const findAdmin = await users.findOne({ email: email });

        if (findAdmin) {

            const passwordMatch = await bcrypt.compare(password, findAdmin.password);

            if (passwordMatch) 
            {

                if(findAdmin.is_admin===0){
                    res.render('adminLogin',{message1: 'oops! looks like you are not an admin'})
                }else{
                    res.redirect('/admin/dashboard')
                } 

            } 
            else {

                const message = 'invalid password'
                res.render('adminLogin', { message });
                console.log('password is incorrect');
            }


        } else {

            res.render('adminLogin', { message1: 'email is not found' });
            console.log('email not foud in the database');
        }

    } catch (error) {
        console.log(error.message);
    }
}







const loadDashboard = async (req,res)=>{
    try {
        res.render('dashboard')

    } catch (error) {
        console.log(error.message);
            
    }
}



const blockUser = async (req,res)=>{
     try {
        const userId = req.body.userID

        const findUser = await users.findById({_id:userId});
        findUser.is_blocked= true;
        const data =  await findUser.save();
        if(data){
            res.json({message: "user is blocked succesfully"})
        }

     } catch (error) {
        
        console.log(error.message);
     }
   
  
}


const unBlockUser = async(req,res)=>{
    try {
        const userId = req.body.userID

        const findUser = await users.findById({_id:userId});
        findUser.is_blocked= false;
        const data =  await findUser.save();
        if(data){
            res.json({message: "user is UnBlocked succesfully"})
        }

    } catch (error) {

        console.log(error.message);
    }
}

module.exports={
    adminLoginLoad,
    verifyAdmin,
    loadDashboard,
    blockUser,
    unBlockUser
}