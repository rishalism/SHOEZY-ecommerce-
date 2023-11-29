const { log } = require('console');
const users = require('../models/userModel');
const categories = require('../models/categoriesModel');
const bcrypt = require('bcrypt');
const { name } = require('ejs');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/otpVerification');
const products = require('../models/productModel');
const session = require('express-session');
let userid = 0
let userotp = 0



function generateOTP() {
    const randomBytes = crypto.randomBytes(4);
    const otp = randomBytes.readUInt32BE(0);
    return (otp % 1000000).toString().padStart(6, '0');

}




const securepassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}





const usersignupLoad = async (req, res) => {
    try {
        res.render('userSignup');
    } catch (error) {
        console.log(error.message);
    }

}




const insertUser = async (req, res) => {
    const spassword = await securepassword(req.body.password)
    const checkemail = req.body.email;
    const username = req.body.firstname;
    try {
        const usersubmit = new users({
            firstName: req.body.firstname,
            secondName: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            is_admin: 0,
            is_verified: 0,
            is_blocked: 0
        })
        const userdata = await usersubmit.save();
        userid = userdata._id;
        if (userdata) {
            const clientOtp = await generateOTP();
            req.session.user_id = userid
            req.session.otp = clientOtp;
            userotp = clientOtp
            console.log(clientOtp, checkemail);
            sendVerificationEmail(checkemail, clientOtp, username);
            res.redirect('/otpverification')

        }

    } catch (error) {
        console.error(error.message);
    }
}





const otpLoad = async (req, res) => {
    try {
        res.render('otpverification')
    } catch (error) {
        console.log(error.message);
    }

}



const verifyOtp = async (req, res) => {
    try {
        if (userotp === req.body.otp) {
            await users.updateOne({ _id: userid }, { $set: { is_verified: 1 } }).exec();
            res.redirect('/home');
        } else {
            res.render('otpverification', { message: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.log(error.message);
    }
};





const loginloaduser = async (req, res) => {
    console.log(req.session);
    try {
        res.render('userLogin')
    } catch (error) {
        console.log(error.message);
    }
}





const verifyUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const finduser = await users.findOne({ email: email });
        if (finduser) {
            const passwordMatch = await bcrypt.compare(password, finduser.password);
            if (finduser.is_blocked == 1) {
                res.render('userLogin', { message: 'you have been blocked by the admin' });

            } else if (passwordMatch) {
                req.session.user_id = finduser._id;
                res.redirect('/home')
            } else if (!passwordMatch) {
                res.render('userLogin', { message: 'invalid password' })
            }

            else {

                res.render('userLogin', { message1: 'email is not found' });
                console.log('email not foud in the database');
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}





const loadHome = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.log(error, message);
    }
}





const loadShop = async (req, res) => {
    try { 
        if(req.query.cat){
            const categoryCollection = await categories.find({is_listed : 0 });
        const data = req.query.cat
        const product = await products.find({ category: data }); 
        res.render('shop', { category: categoryCollection, product });
         }
        else{
        const categoryCollection = await categories.find({is_listed : 0 });
        const product = await products.find();
        res.render('shop', { category: categoryCollection, product });
        }
    } catch (error) {

        console.log(error.message);
    }
}


const loadAboutUs = async (req, res) => {

    try {
        res.render('about');

    } catch (error) {

        console.log(error.message);
    }
}


const loadContact = async (req, res) => {
    try {
        res.render('contact')
    } catch (error) {
        console.log(error.message);
    }
}


const loadProductDetails = async(req,res)=>{
    try { 
        const id = req.query.id
        const findproduct = await products.findById({_id : id})
         res.render('shop-details',{product : findproduct})
    } catch (error) {
        
        console.log(error.message);
    }
}

module.exports = {
    usersignupLoad,
    insertUser,
    otpLoad,
    loginloaduser,
    loadHome,
    verifyUser,
    verifyOtp,
    loadShop,
    loadAboutUs,
    loadContact,
    loadProductDetails
}