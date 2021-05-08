const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');

function requireAuth(request, response, next) {
    const token = request.cookies.jwt;

    // Check JWT exists and is verified
    if (token) {
        jwt.verify(token, keys.jwt.secret, (error, decodedToken) => {
            if (error) {
                response.redirect('/login');
                console.log(error.message);
            } else {
                next();
            }
        });
    } else {
        response.redirect('/login');
    }
}

// Check current user
function checkUser(request, response, next){
    const token = request.cookies.jwt;

    if (token) {
        jwt.verify(token, keys.jwt.secret, async (error, decodedToken) => {
            if (error) {
                console.log(error.message);
                response.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodedToken.id);
                response.locals.user = user;
                next();
            }
        });
    } else {
        response.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };
