const User = require('../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

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
    if (error.message === 'incorrect email') {
        errorsObject.email = error.message;
    }
    if (error.message === 'incorrect password') {
        errorsObject.password = error.message;
    }

    return errorsObject;
}

const maxAge = 3 * 24 * 60 * 60;

function createToken(id) {
    return jwt.sign({ id }, keys.jwt.secret, {
        expiresIn: maxAge
    });
}

function signup_get(request, response) {
    response.render('signup');
}

function login_get(request, response) {
    response.render('login');
}

function logout_get (request, response) {
    response.cookie('jwt', '', {
        maxAge: 1
    });
    response.redirect('/');
}

async function signup_post(request, response) {
    const { email, password } = request.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        response.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        response.json({ errors });
    }
}

async function login_post(request, response) {
    const { email, password } = request.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        response.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        response.status(400).json({ errors });
    }
}

module.exports = { signup_get, login_get, signup_post, login_post, logout_get };