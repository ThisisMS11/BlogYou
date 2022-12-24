require('dotenv').config();

const express = require('express');
const User = require('../models/User.js');

const router = express.Router();

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const fetchuser = require('../middlewares/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {

    const currentTime = new Date();
    const localtime = currentTime.toLocaleString();

    const { username, userID, email } = req.body;

    let lastloginUser = {};

    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {

            if (userID) { lastloginUser.userID = userID }
            if (username) { lastloginUser.username = username }
            if (email) { lastloginUser.email = email }


            lastloginUser.LastLoginTime = localtime;

            lastloginUser = await User.findByIdAndUpdate(user.id, { $set: lastloginUser }, { new: true })

            let data2 = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data2, JWT_SECRET);

            res.json({ success: true, result: "User Info updated", lastloginUser, authtoken})
        }


        else {
            // ! this is the part where we are adding user information into database
            user = await User.create({
                userID: userID,
                username: username,
                email: email,
                LastLoginTime: localtime
            });

            // !The data to be used in signing our web token is here
            const data = {
                user: {
                    id: user.id
                }
            }

            // ! Signing the web token with payload and our secret code.
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({ success: true, authtoken });
        }



    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})

router.post('/login', async (req, res) => {

    let success = false;

    const { email, password, sub } = req.body;

    try {

        let user = await User.findOne({ email });

        console.log('logged in userinformation :- ', user);


        // if we didn't find any user then user=False; !user=True
        if (!user) {
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }

        // !  converting the hash code that is our user.password into normal terms and comparing it with the req.body.password

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }


        // generating a fresh auth token.(Auth Token is not saved in the database we create a new one every time user logins)
        console.log('our jwt secret:-', JWT_SECRET);

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authtoken })

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }

})

// for getting userinfo using the authtoken provided at the time of login and signup

router.get('/userinfo', fetchuser, async (req, res) => {
    // res.json({ success: true, authtoken })
    let success = true;

    try {
        const userId = req.user.id;
        // All data except the user password is getting selected here
        const user = await User.findById(userId).select("-password");

        res.json({ success: true, user });

    } catch (error) {
        success = false;
        console.log(error);
        res.json({ success: false, error });
    }
})

module.exports = router