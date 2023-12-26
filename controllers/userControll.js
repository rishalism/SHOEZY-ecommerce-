const { log } = require('console');
const users = require('../models/userModel');
const categories = require('../models/categoriesModel');
const bcrypt = require('bcrypt');
const { name } = require('ejs');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/otpVerification');
const products = require('../models/productModel');
const address = require('../models/userDetailsModel');
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

        /////////////////// check email exists ///////////////////////
        const findemail = await users.findOne({ email: checkemail });
        if (!findemail) {
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
                req.session.user = userdata;
                req.session.otp = clientOtp
                userotp = clientOtp
                console.log(clientOtp, checkemail);
                await sendVerificationEmail(checkemail, clientOtp, username);
                res.redirect('/otpverification')

            }
        } else {
            res.render('userSignup', { message1: 'email already in use , please try another one !' })
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



const resendOtp = async (req, res) => {
    try {
        const clientOtp = await generateOTP();
        console.log(clientOtp);
        const checkemail = req.session.user.email;
        const username = req.session.user.firstName;

        // Update the session with the new OTP
        req.session.otp = clientOtp;

        // Send the verification email
        await sendVerificationEmail(checkemail, clientOtp, username);

        res.render('otpverification', { message: 'OTP has been resent successfully.' });

    } catch (error) {
        console.log(error.message);
        res.render('otpverification', { message: 'Error resending OTP. Please try again.' });
    }
};




const verifyOtp = async (req, res) => {
    try {
        console.log(req.session.otp);

        if (req.session.otp === req.body.otp) {
            const data = await users.updateOne({ _id: userid }, { $set: { is_verified: 1 } }).exec();
            res.redirect('/home');
        } else {
            res.render('otpverification', { message: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.log(error.message);
    }
};




const loginloaduser = async (req, res) => {
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
                req.session.user = finduser;
                res.redirect('/home');
            } else {
                // Invalid password
                res.render('userLogin', { message: 'invalid password' });
            }

        } else {
            // Email not found in the database
            res.render('userLogin', { message1: 'email is not found' });
            console.log('email not found in the database');
        }

    } catch (error) {
        console.log(error.message);
    }
};











const editProfile = async (req, res) => {
    try {
        const { firstname, secondname, mobile } = req.body
        console.log(req.body);
        const userid = req.session.user._id
        const updateProfile = await users.findByIdAndUpdate({ _id: userid }, {
            $set: {
                firstName: firstname,
                secondName: secondname,
                mobile: mobile
            }
        })

        if (updatePassword) {
            res.json({ message: "updated succefully" });
        }
    } catch (error) {

        console.log(error.message);
    }
}









const logOut = async (req, res) => {
    try {

        req.session.destroy()
        res.redirect('/')
    } catch (error) {

        console.log(error.message);
    }
}


const loadHome = async (req, res) => {
    try {
        if (req.session.user) {
            const userID = req.session.user._id
            const userdata = await users.findById({ _id: userID });
            res.render('home', { userdata });
        } else {
            res.render('home',)
        }
    } catch (error) {
        console.log(error.message);
    }
}





const loadShop = async (req, res) => {
    try {
        if (req.query.cat) {
            const categoryCollection = await categories.find({ is_listed: 0 });
            const data = req.query.cat
            const product = await products.find({ category: data })
            res.render('shop', { category: categoryCollection, product });
        }
        else {
            const categoryCollection = await categories.find({ is_listed: 0 });
            const producta = await products.find().populate('category');
            const product = producta.filter(producta => producta.category.is_listed == 0)
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


const loadProductDetails = async (req, res) => {
    try {
        const id = req.query.id
        const findproduct = await products.findById({ _id: id })
        const catgoryid = findproduct.category
        const relatedproducts = await products.find({ category: catgoryid });

        res.render('shop-details', { product: findproduct, Products1: relatedproducts });
    } catch (error) {

        console.log(error.message);
    }
}




const loadProfile = async (req, res) => {
    try {
        if (req.session.user) {
            const finduser = await users.findById({ _id: req.session.user._id })
            const Address = await address.find({ user: req.session.user._id })
            res.render('userAccount', { user: finduser, Address });
        } else {
            res.redirect('/register')
        }
    } catch (error) {

        console.log(error.message);
    }
}



const saveUser = async (req, res) => {
    try {

        const userID = req.session.user._id;
        const { streetAddress: streetAddress, city: town, zip: zipcode, state, apartment: houseName, country } = req.body
        const saveUser = new address({
            user: userID,
            state: state,
            town: town,
            streetAddress: streetAddress,
            houseName: houseName,
            country: country,
            zipcode: zipcode
        })
        const saving = await saveUser.save();
        if (saving) {
            res.status(200).json({ message: 'succefuly added details' })
        }

    } catch (error) {

        console.log(error.message);
    }
}






const changePassword = async (req, res) => {
    try {
        const newPassword = req.body.password;
        const userid = req.session.user._id;
        const finduser = await users.findOne({ _id: userid });
        const checkpassword = await bcrypt.compare(newPassword, finduser.password);
        if (checkpassword) {
            res.status(200).json({ value: 0 });
        } else {
            res.status(200).json({ message: 'password is incorrect', value: 1 })
        }

    } catch (error) {

        console.log(error.message);
    }
}



const updatePassword = async (req, res) => {
    try {
        const newPassword = req.body.password;
        const hashedPassword = await securepassword(newPassword);
        const updatePassword = await users.findOneAndUpdate({ _id: req.session.user._id }, {
            $set: { password: hashedPassword }
        });
        if (updatePassword) {
            res.status(200).json({ message: 'password updated succesfully' });
        }


    } catch (error) {

        console.log(error.message);
    }
}




const loadEdditUserAddress = async (req, res) => {
    try {
        if (req.session.user) {
            const finduser = await users.findById({ _id: req.session.user._id })
            const Address = await address.find({ user: req.session.user._id })
            res.render('address-editing', { user: finduser, Address });

        } else {
            res.redirect('/register')

        }
    } catch (error) {

        console.log(error.message);
    }
}



const editAddress = async (req, res) => {
    try {
        const userid = req.query.id
        const userID = req.session.user._id
        const { streetAddress: streetAddress, apartment: houseName, city: town, state: state, zipcode: zipcode, country: country } = req.body
        const Editddress = await address.findByIdAndUpdate({ _id: userid }, {
            user: userID,
            state,
            town,
            streetAddress,
            houseName,
            country,
            zipcode
        });

        if (Editddress) {
            res.redirect('/add-address')
        }

    } catch (error) {

        console.log(error);
    }
}








const loadBLock = async (req, res) => {
    try {
        res.render('404');
    } catch (error) {

        console.log(error.message);
    }
}



const LoadforgotPassword = async (req, res) => {
    try {

        res.render('forgot-password')

    } catch (error) {

        console.log(error.message);
    }
}


const checkEmail = async (req, res) => {
    try {
      const { email } = req.body;
      console.log('ethiii');

      const checkEmail = await users.findOne({ email: email });
  
      if (!checkEmail) {
        // If email is not registered
        return res.status(200).json({ message: 'Email is not registered', value: 0 });
      } else {
        // If email is registered
        return res.status(200).json({ message: 'Email is registered', value: 1 });
      }
  
    } catch (error) {
      // Handle errors and send an appropriate response
      console.error(error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  



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
    loadProductDetails,
    logOut,
    loadProfile,
    saveUser,
    loadEdditUserAddress,
    editAddress,
    loadBLock,
    resendOtp,
    changePassword,
    updatePassword,
    editProfile,
    LoadforgotPassword,
    checkEmail
}