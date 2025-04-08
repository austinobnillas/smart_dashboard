const pool = require("../config/database");


module.exports = {
    getAllUsers: () => {
        return pool.promise().query("SELECT * FROM users")
            .then(([rows]) => rows);
    }

}