const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async(req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        var messages = await Message.create(newMessage);

        messages = await messages.populate("sender", "name profile_pic");
        messages = await messages.populate("chat");
        messages = await User.populate(messages, {
            path: "chat.users",
            select: "name profile_pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: messages });

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
const allMessages = asyncHandler(async(req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name profile_pic email")
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
module.exports = { sendMessage, allMessages };