const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Handle errors
function handleErrors(error) {
    let errorsObject = { email: '', password: '' };

    if (error.code === 11000) {
        errorsObject.email = 'That email is already registered';
        return errorsObject;
    }

    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {
            errorsObject[properties.path] = properties.message;
        });
    }
    return errorsObject;
}

const maxAge = 3 * 24 * 60 * 60;

function createToken(id) {
    return jwt.sign( { id }, 'secret', { 
        expiresIn: maxAge
    } );
}

function signup_get(request, response) {
    response.render('signup');
}

function login_get(request, response) {
    response.render('login');
}

async function signup_post(request, response) {
    const { email, password } = request.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        response.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        response.json({ errors });
    }
}

function login_post(request, response) {
    const { email, password } = request.body;
    response.send('new login');
}

module.exports = { signup_get, login_get, signup_post, login_post };