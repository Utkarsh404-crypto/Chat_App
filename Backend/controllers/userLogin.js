const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken')

const userLogin = asyncHandler(async(req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please Provide Credentials");
    }

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.profile_pic,
            token: generateToken(user._id),

        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }


})

module.exports = { userLogin }