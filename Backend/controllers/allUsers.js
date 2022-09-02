const asyncHandler = require('express-async-handler');
const { model } = require('mongoose');
const User = require('../models/userModel');

const allUsers = asyncHandler(async(req, res) => {
    const key = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ],
    } : {}

    const users = await User.find(key).find({ _id: { $ne: req.user._id } });

    res.send(users);
});

module.exports = { allUsers }