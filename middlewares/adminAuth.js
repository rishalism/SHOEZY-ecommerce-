// Middleware Functions


const isLoggedIn = (req, res, next) => {
    try {
        if (req.session.admin) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


const isLoggedOut = (req, res, next) => {
    try {
        if (req.session.admin) {
            console.log('Already logged in');
            res.redirect('/admin/dashboard');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    isLoggedIn,
    isLoggedOut
};
