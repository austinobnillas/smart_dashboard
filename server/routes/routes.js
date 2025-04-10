const { authenticate } = require("../config/jwt.config");
const User = require("../controllers/user.controller");

module.exports = app => {
    //user functions, login/logout
    app.get('/api/test', authenticate, User.getAllUsers)
    app.post('/api/register', User.register)
    app.delete('/api/delete', User.delete)
    app.post('/api/login', User.login)
    app.post('/api/logout', User.logout)
}