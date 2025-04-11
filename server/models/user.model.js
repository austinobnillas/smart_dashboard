const pool = require("../config/database");

module.exports = {
    getAllUsers: () => {
        return pool.promise().query("SELECT * FROM users")
            .then(([rows]) => rows)
            .catch((err) => console.log(err));
    },
    getOneUser: async (req) => {
        try {
            //sql query that queires the db for the username, each username is unique, destructured returned data array 
            const [data] = await pool.promise().query(`SELECT * FROM users WHERE BINARY username LIKE ? `, [req.username])
            //return single user object
            return data[0]
            } catch (err) {
                console.log(err);
                throw err;
        }
    },
    registerUser: async (username, pw) => {
            try {
                //insert user into database
                const [newUser] = await pool.promise().query(
                    `INSERT INTO users (username, pw) VALUES (?, ?)`,
                    [username, pw]
                );
                return {msg: "Account created Successfully "};
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
    //this this temporary
    delete: async (req, res) => {
        try {
            const deleted = await pool.promise().query("DELETE FROM users WHERE id = ?", [req.id]);
            console.log(deleted);
            return {msg: "deleted", deleted}
            } catch (err) {
                console.log(err);
                throw err;
        }
    }

}