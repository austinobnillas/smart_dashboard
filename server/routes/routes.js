const { authenticate } = require("../config/jwt.config");
const User = require("../controllers/user.controller");
const Note = require("../controllers/note.controller");

module.exports = app => {
    //user functions, login/logout
    app.get('/api/test', authenticate, User.getAllUsers)
    app.post('/api/register', User.register)
    app.delete('/api/delete', User.delete)
    app.post('/api/login', User.login)
    app.post('/api/logout', User.logout)
    //note functions
    app.post('/api/addnote', authenticate, Note.addNote)
    app.get('/api/notes', authenticate, Note.getUserNotes)
    app.delete('/api/deletenote/:id', authenticate, Note.deleteNotes)
}