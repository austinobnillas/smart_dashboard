const pool = require("../config/database");

module.exports = {
    getAllUsers: () => {
        return pool.promise().query("SELECT * FROM users")
            .then(([rows]) => rows)
            .catch((err) => console.log(err));
    },
    getOneUser: async (req) => {
        try {
            const [data] = await pool.promise().query(`SELECT * FROM users WHERE BINARY username LIKE ? `, [req.username])
            return data
            } catch {
            (err) => console.log(err)
        }
    },
    registerUser: async (username, pw) => {
            try {
                const [result] = await pool.promise().query(
                    `INSERT INTO users (username, pw) VALUES (?, ?)`,
                    [username, pw]
                );
                return result;
            } catch (err) {
                (err) => console.log(err);
                throw err;
            }
        },
    login: async () => {
        pass
    },
    //this this temporary
    delete: async (req, res) => {
        try {
            const deleted = await pool.promise().query("DELETE FROM users WHERE id = ?", [req.id]);
            console.log(deleted);
            return {msg: "deleted", deleted}
            } catch {
            (err) => console.log(err)
        }
    }

}