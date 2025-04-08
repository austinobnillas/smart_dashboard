const { authenticate } = require("../config/jwt.config");
const User = require("../controllers/user.controller");

module.exports = app => {
    app.get('/api/test', User.getAllUsers)
}