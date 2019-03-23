const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;
const FAKE_ROOM = "AAAA";

let rooms = new Set();

app.get("/", (req, res) => {
    res.send("<p>This is the Hackbox backend. It is meant to be accessed with socket.io </p>");
});

io.on("connection", socket => {
    console.log(`${socket.id} connected`);
    socket.on("request room", () => {
        if (!rooms.has(FAKE_ROOM))
            rooms.add(FAKE_ROOM);
        socket.emit("request room", FAKE_ROOM); //TODO make this randomly generated
    });
    socket.on("join", roomcode => {
        if (rooms.has(roomcode)) {
            socket.join(roomcode); //TODO add error handling to see if this room is valid/full
            socket.emit("join", true);
        }
        else {
            socket.emit("join", false);
        }
    });
});

/*
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("chat message", msg => {
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
});
*/

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});