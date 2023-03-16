const express = require('express')
const app = require("express")()
const dotenv = require("dotenv")
const { chats } = require('./data/data')
const connectToDb = require('./config/db')
const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const messageRoute = require('./routes/messageRoute')
const { notFound, errors } = require('./middleware/errors')
const path = require("path")


dotenv.config();
connectToDb();

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/message", messageRoute);

//Deployment//

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "/frontend/build")));

//     app.get("*", (req, res) =>
//         res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//     );
// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running..");
//     });
// }
//Deployment//

app.use(notFound);
app.use(errors);

const PORT = process.env.PORT || 8080
const server = app.listen(8080, () => {
    console.log(`Server Listening at port ${PORT}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3001",

    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log(`User Joined The Room ${room}`);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessage) => {
        var chat = newMessage.chat;

        if (!chat.users) return console.log("not defined");

        chat.users.forEach(user => {
            if (user._id === newMessage.sender._id) return;

            socket.in(user._id).emit("message received", newMessage);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});