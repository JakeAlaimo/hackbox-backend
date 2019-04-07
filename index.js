const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fs = require("fs");
const Room = require("./modules/room");

const PORT = process.env.PORT || 3000;
const FAKE_ROOM = "AAAA";

let rooms = new Set();


// Prepare csv data 
let contents = fs.readFileSync("./data/categories.csv", "UTF8");
let categories = contents.split(/,/gm);

app.get("/", (req, res) => {
    res.send("<p>This is the Hackbox backend. It is meant to be accessed with socket.io </p>");
});

io.on("connection", socket => {
    console.log(`${socket.id} connected`);

    socket.on("request room", () => {
        let res = {};
        let room = new Room(getRandomRoomCode(), categories.slice(0));
        rooms.add(room);
        res.roomcode = room.code;
        socket.emit("request room", JSON.stringify(res));      
    });

    socket.on("join room", payload => {
        let payloadObj = JSON.parse(payload);
        let res = {};
        if (rooms.has(payloadObj.roomcode)) {
            socket.join(payloadObj.roomcode);
            res.joined = true;
        }
        else {
            res.joined = false;
        }
        socket.emit("join room", JSON.stringify(res));
    });

    socket.on("start game", payload => {
        let payloadObj = JSON.parse(payload);
        // Get and remove a random category from this room
        // Pick two random sockets to be the players
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


/**
 * Returns a unique, random room code
 */
function getRandomRoomCode()
{
    // TODO Implement this
    return "AAAA";
}