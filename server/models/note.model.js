const pool = require("../config/database");

module.exports = {
    addNote: async (req, userId) => {
            try {
                //insert new note into dababase based on signed in user's id
                const [notes] = await pool.promise().query(
                    `INSERT INTO notes (title, note, user_id) VALUES (?, ?, ?)`,
                    [req.title, req.note, userId]
                );
                // return the newly generated note
                const [newNote] = await pool.promise().query(
                    `SELECT * FROM notes WHERE id = ?`,
                    [notes.insertId]
                );
                return newNote[0];

            } catch (err) {
                console.log(err);
                throw err;
            }
        },
    getNotes: async (userId) => {
        //get signed in user's notes
        try {
            const [notes] = await pool.promise().query(
                `SELECT * FROM notes WHERE user_id = ?`, [userId]
            );
            // return array of note objects
            return notes;
        } catch (err){
            console.log(err);
            throw err;
        }
    },
    deleteNote: async (noteId, userId) => {
        try {
            // check if there is a user id with correlating note id
            const noteCheck = await pool.promise().query("SELECT * FROM notes WHERE id = ? AND user_id = ?", [noteId, userId]);
            if (noteCheck.length === 0) {
                // If no note found or the note doesn't belong to the user
                return { msg: "You can only delete your own notes.", error: 1};
            }
            //delete note after check
            const [deleted] = await pool.promise().query("DELETE FROM notes WHERE id = ?", [noteId]);
            return {msg: "deleted", deleted}
            } catch (err) {
                console.log("Error caught:", err);
                throw err; 
        }
    }
}