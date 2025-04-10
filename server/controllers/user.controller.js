const User = require("../models/user.models")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const validate = require("../utils/validations");

module.exports = {
    getAllUsers: (req, res) => {
        User.getAllUsers()
            .then(users => res.send(users) )
            .catch(err => console.log(err))
    },
    register: async (req, res) => {

        //validating user data on app level to ensure clean data to the database
        const { valid, errors } = validate.validateUserData(req.body);
        if (!valid) {
            return res.status(400).json({ msg: "Validation failed", errors });
        }
        //if data is clean 
        try{
            const user = await User.getOneUser({username: req.body.username});
            console.log(user)
            if (user.length > 0) {
                return res.status(400).json({msg: "Username already in use!"})
            } else {
                // Hash the password and add user to database
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(req.body.pw, saltRounds);
                await User.registerUser(req.body.username, hashedPassword)

                //generate cookie upon succesful registration
                const userToken = jwt.sign({
                    username: req.body.username,
                }, secret, {expiresIn: '2h'});
                //response with cookie and successful login
                res.status(201).cookie('userToken', userToken, {httpOnly: true, maxAge: 7200000}).json({ msg: "User created successfully!" });
            }
        } catch (err){
            res.status(400).json(err);
            console.log(err)
        }
    },
    
    login: async (req, res) => {
        try{
            const user = await User.getOneUser({username: req.body.username});
            if (user.length < 1) {
                return res.status(400).json({msg: "Invalid username or password1"})
            }
            const correctPassword = await bcrypt.compare(req.body.pw, user[0].pw);
            console.log(correctPassword)
            if (!correctPassword) {
                return res.status(400).json({msg: "Invalid username or password"});
            }
            else {
                const userToken = jwt.sign({
                    _id: user._id,
                    username: user.username
                }, secret, {expiresIn: "2h"});
                res.status(200).cookie('userToken', userToken, {httpOnly: true, maxAge: 7200000}).json({msg: "Successful login!", user: user})
            }
        }
        catch(err){
            res.status(400).json(err);
        }
    },
    logout: (req, res) => {
        res.clearCookie('userToken');
        res.sendStatus(200);
    },
    //this is temporary
    delete: async (req, res) => {
        try {
            const deleted = await User.delete(req.body)
            res.status(200).send(deleted)
        } catch {
            (err) => {console.log(err)}
        }
    }

}