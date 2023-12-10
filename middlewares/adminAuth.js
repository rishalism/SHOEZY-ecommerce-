// Middleware Functions

const isLoggedIn = async (req, res, next) => {
    try {
        if (req.session.admin) {
            next();

        } else {
            res.redirect('/admin');
        }

    } catch (error) {
        console.log(error.message);
    }
};

const isLoggedOut = async (req, res, next) => {
    try {
        if (req.session.admin) {
            console.log('Already logged in');
            res.redirect('/admin/dashboard');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLoggedIn,
    isLoggedOut
};
