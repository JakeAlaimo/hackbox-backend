const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fs = require("fs");
const Room = require("./modules/room");
const Player = require("./modules/player");

const PORT = process.env.PORT || 3000;
const FAKE_ROOM = "AAAA";

let rooms = new Map();


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
        let room = new Room(getRandomRoomCode(), categories.slice(0)); // Pass in a copy of categories 
        rooms.set(room.code, room);
        res.roomcode = room.code;
        socket.emit("request room", JSON.stringify(res));      
    });

    socket.on("join room", payload => {
        let payloadObj = JSON.parse(payload);
        let res = {};
        if (rooms.has(payloadObj.roomcode)) {
            let room = rooms.get(payloadObj.roomcode);
            // If this room already has this username
            if (room.hasPlayer(payloadObj.username)) {
                res.joined = false;
                res.failReason = "Username is taken";
            } 
            else {
                socket.join(payloadObj.roomcode);
                room.players.push(new Player(payloadObj.username));
                res.joined = true;
                res.failReason = "";
            }
        }
        else {
            res.joined = false;
            res.failReason = "Room does not exist";
        }
        socket.emit("join room", JSON.stringify(res));
    });

    socket.on("start game", payload => {
        let payloadObj = JSON.parse(payload);
        let res = {};
        // Get and remove a random category from this room
        let room = rooms.get(payloadObj.roomcode);
        // TODO explore condition where all categories are played
        let category = room.getAndRemoveRandomCategory();
        res.category = category;
        // Pick two random sockets to be the players
        let selectedPlayers = room.selectPlayers();
        res.player1Name = selectedPlayers[0].username;
        res.player2Name = selectedPlayers[1].username;
        io.to(payloadObj.roomcode).emit("start game", res);
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
    return "ABCD";
}