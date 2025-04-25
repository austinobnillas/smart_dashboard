const User = require("../models/user.model")
const Note = require("../models/note.model")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const validate = require("../utils/validations");

module.exports = {
    getUserNotes: async (req, res) => {
        try {
            //get signed in user's notes, decoding cookie to get the username 
            const decoded = jwt.decode(req.cookies.userToken, secret)
            const userData = await User.getOneUser(decoded)
            const note = await Note.getNotes(userData.id)
            // return the array of notes
            res.status(200).send(note)

        } catch (err){
            res.status(400).json(err);
            console.log(err)
        }
    },
    addNote: async (req, res) => {
        //validate input data from the user inputted notes from the front end
        const { valid, errors } = validate.validateNoteData(req.body);
        if (!valid) {
            return res.status(400).json({ msg: "Validation failed", errors });
        }
        try {
            //decode user token to retreive username and find the user within the database
            const decoded = jwt.decode(req.cookies.userToken, secret)
            const userData = await User.getOneUser(decoded)
            // pass the note with the user id to the db 
            const note = await Note.addNote(req.body, userData.id)
            // return newly generated note
            res.status(200).send(note)

        } catch (err){
            res.status(400).json(err);
            console.log(err)
        }
        
    },
    //edit to be added later
    editNote: async () => {

    },
    deleteNotes: async (req, res) => {
        try {
            //get signed in user's notes, decoding cookie to get the username 
            const decoded = jwt.decode(req.cookies.userToken, secret)
            const userData = await User.getOneUser(decoded)
            //delete note based on note id and user id
            const deletedNote = await Note.deleteNote(req.params.id, userData.id)
            console.log(deletedNote)
            //if user id and note id do not have a match
            if (deletedNote.error) {
                res.status(403).send(deletedNote.msg)
            }
            res.status(200).send(deletedNote)
        } catch (err) {
            console.log("Error caught:", err);
            // Respond with an error message and status code
            res.status(500).send({ msg: "An error occurred while deleting the user", error: err });
            
        }
    }
}