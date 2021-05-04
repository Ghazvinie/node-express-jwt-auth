const User = require('../models/User');

// Handle errors
function handleErrors(error) {
    let errors = {};

    if (error.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
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
        response.status(201).json(user);
    } catch (error) {
        const errors = handleErrors(error);
        response.json(errors);
    }
}

function login_post(request, response) {
    const { email, password } = request.body;
    response.send('new login');
}

module.exports = { signup_get, login_get, signup_post, login_post };