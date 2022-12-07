const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    //grab users cookie if it exists
    //proceed to next middleware function in router if good, else redirect to login
    const token = req.cookies.jwt;
    
    if (token) {
        jwt.verify(token, 'my super secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next()
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

//check current user by their token so we can use users information in templates like to display emails etc.
//res.locals lets us specify a local variable property that we've named .user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'my super secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };