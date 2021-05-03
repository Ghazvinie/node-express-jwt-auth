function signup_get(request, response) {
    response.render('signup');
}

function login_get(request, response) {
    response.render('login');
}

function signup_post(request, response) {
    response.send('new signup');
}

function login_post(request, response) {
    response.send('new login');
}

module.exports = { signup_get, login_get, signup_post, login_post };