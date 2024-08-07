const express = require('express')
const User = require('../../models/User/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

//Sign up Endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            return res.status(203).json({ "Error": "User with email already exists" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        return res.status(200).json({ "Success": "User Created Successfully" });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ "Error": "Internal Server Error" });
    }
});

//login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        console.log("User")
        console.log(user)
        if (!user) {
            return res.status(403).json({ "Error": "User not found" });
        }

        const userObj = {
            _id: user._id,
            email: email,
            password: password
        }

        const token = jwt.sign(userObj, process.env.SECRET_TOKEN);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({ "user": user, "token": token });
        } else {
            return res.status(403).json({ "Error": "Wrong Credentials" });
        }
    } catch (error) {
        return res.status(403).json({ "Error": error });
    }
});

router.get('/logout', (req, res) => {
    try {
        return res.status(200).send({"Success" : "Logout Successfull"})
    } catch (error) {
        return res.status(403).json({ "Error": error });
    }
})

module.exports = router;