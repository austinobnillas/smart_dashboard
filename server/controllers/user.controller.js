const User = require("../models/user.models")

module.exports = {
    getAllUsers: (req, res) => {
        User.getAllUsers()
            .then(users => res.send(users) )
            .catch(err => console.log(err))
    },
    
}