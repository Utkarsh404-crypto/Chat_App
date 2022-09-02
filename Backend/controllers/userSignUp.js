const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken')

const userSignUp = asyncHandler(async(req, res) => {

    const { name, email, password, profile_pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Provide Credentials");
    }

    const userAlreadyExists = await User.findOne({ email, name })

    if (userAlreadyExists) {

        res.status(400);
        throw new Error("User Already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        profile_pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.profile_pic,
            token: generateToken(user._id),
        })
    } else {

        res.status(400);
        throw new Error("User Not Created");
    }
})

module.exports = { userSignUp }