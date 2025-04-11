const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const validate = require("../utils/validations");

module.exports = {
    //test function
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
            //retrieve user based on username, application is set so that each user has a unique username.
            const user = await User.getOneUser({username: req.body.username});
            //if username is already in use
            if (user) {
                return res.status(400).json({msg: "Username already in use!"})
            } else {
                // Hash the password and add user to database
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(req.body.pw, saltRounds)
                const success = await User.registerUser(req.body.username, hashedPassword)

                //sign jwt cookie upon succesful registration
                const userToken = jwt.sign({
                    username: req.body.username,
                }, secret, {expiresIn: '2h'});
                //response with cookie and successful login
                res.status(201).cookie('userToken', userToken, {httpOnly: true, maxAge: 7200000}).json({ msg: success.msg });
            }
        } catch (err){
            res.status(400).json({err: err, msg: "Something went wrong"});
            console.log(err)
        }
    },
    login: async (req, res) => {
        try{
            //retrieve user based on given username
            const user = await User.getOneUser({username: req.body.username});
            //if user is undefined or null, if the above function doesn't find a matching username
            if (!user) {
                return res.status(400).json({msg: "Invalid username or password1"})
            }
            //using bcrypt to compare the inputted password with the hashed password in the db
            const correctPassword = await bcrypt.compare(req.body.pw, user.pw);
            if (!correctPassword) {
                return res.status(400).json({msg: "Invalid username or password"});
            }
            //if there is a match, a jwt token is generated
            else {
                const userToken = jwt.sign({
                    username: user.username
                }, secret, {expiresIn: "2h"});
                res.status(200).cookie('userToken', userToken, {httpOnly: true, maxAge: 7200000}).json({msg: "Successful login!", user: user.username, token: userToken})
            }
        }
        catch(err){
            res.status(400).json(err);
        }
    },
    //logout clears cookie
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