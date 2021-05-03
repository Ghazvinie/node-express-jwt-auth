const User = require('../models/User');

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
        console.log(error);
        response.send(400).send('Error, the user was not created');
    }
}

function login_post(request, response) {
    const { email, password } = request.body;
    response.send('new login');
}

module.exports = { signup_get, login_get, signup_post, login_post };