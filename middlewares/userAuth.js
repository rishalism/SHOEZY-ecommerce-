// Middleware Functions
const users = require('../models/userModel');


const isLoggedIn = async (req, res, next) => {
    try {
        if (req.session.user) {

            const userid = req.session.user._id;
            const userdata = await users.findById(userid);

            if (!userdata) {
                return res.redirect('/login')
            }

            if (userdata.is_blocked) {
                console.log('user is blocked');
                return res.status(403).render('404',);
            }
           next()

        } else {
            next()
        }

    } catch (error) {
        console.log(error.message);
    }
};




const isLoggedOut = async (req, res, next) => {
    try {
        if (req.session.user) {
            res.redirect('/home');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};






module.exports = {
    isLoggedIn,
    isLoggedOut,
};
