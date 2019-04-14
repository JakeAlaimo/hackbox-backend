const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {pingInterval: 500});
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
    res.send(
        "<p>This is the Hackbox backend. It is meant to be accessed with socket.io </p>"
    );
});

io.on("connection", socket => {
    console.log(`${socket.id} connected`);

    socket.on("request room", () => {
        let res = {};
        let room = new Room(getRandomRoomCode(), categories.slice(0)); // Pass in a copy of categories
        rooms.set(room.code, room);
        res.roomcode = room.code;

        // Also join this client to the room
        socket.join(room.code);

        socket.emit("request room", JSON.stringify(res));
    });

    socket.on("join room", payload => {
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        } 
        catch (e) {
            socket.emit("game_error", JSON.stringify({"game_error": "Invalid json format"}));
            return;
        }
        let res = {};
        if (rooms.has(payloadObj.roomcode)) {
            let room = rooms.get(payloadObj.roomcode);
            // If this room already has this username
            if (room.hasPlayer(payloadObj.username)) {
                res.joined = false;
                res.username = "";
                res.failReason = "Username is taken";
                socket.emit("join room", JSON.stringify(res));
            } else {
                socket.join(payloadObj.roomcode);
                room.players.push(new Player(payloadObj.username));
                res.joined = true;
                res.username = payloadObj.username;
                res.failReason = "";
                // Notify the entire room of success
                io.to(payloadObj.roomcode).emit("join room", JSON.stringify(res));
            }
        } else {
            res.joined = false;
            res.username = "";
            res.failReason = "Room does not exist";
            socket.emit("join room", JSON.stringify(res));

        }
    });

    socket.on("start game", payload => {
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        } 
        catch (e) {
            socket.emit("game_error", JSON.stringify({"game_error": "Invalid json format"}));
            return;
        }
        let res = {};
        // Get and remove a random category from this room
        let room = rooms.get(payloadObj.roomcode);
        if (!room) {
            socket.emit("game_error", JSON.stringify({"game_error": "Roomcode does not exist"}));
            return;
        }
        if (room.players.length < 2) {
            socket.emit("game_error", JSON.stringify({"game_error": "Room does not have enough players"}));
            return;
        }
        // TODO explore condition where all categories are played
        let category = room.getAndRemoveRandomCategory();
        res.category = category;
        // Pick two random sockets to be the players
        let selectedPlayers = room.selectPlayers();
        res.player1Name = selectedPlayers[0].username;
        res.player2Name = selectedPlayers[1].username;
        io.to(payloadObj.roomcode).emit("start game", JSON.stringify(res));

        //TODO consider allowing customizable intervals
        room.lifetime = 60 //reset the game lifetime

        // Broadcast an initial time changed event
        let initTimeChangedRes = {};
        initTimeChangedRes.time = room.lifetime;
        io.to(payloadObj.roomcode).emit(
            "time changed",
            JSON.stringify(initTimeChangedRes)
        );
        // Start the timer event
        let interval = setInterval(() => {
            let res = {};
            res.time = --room.lifetime;
            io.to(payloadObj.roomcode).emit(
                "time changed",
                JSON.stringify(res)
            );
            if (res.time <= 0) {
                io.to(payloadObj.roomcode).emit("timeout");
                clearInterval(interval);

                //reset the scores of each player
                room.selectedPlayers[0] = 0;
                room.selectedPlayers[1] = 0;
            }
        }, 1000);
    });

    socket.on("enter submission", payload => {
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        } 
        catch (e) {
            socket.emit("game_error", JSON.stringify({"game_error": "Invalid json format"}));
            return;
        }
        let res = {
            player: payloadObj.player,
            submission: payloadObj.submission
        };
        io.to(payloadObj.roomcode).emit(
            "enter submission",
            JSON.stringify(res)
        );
    });

    socket.on("vote", payload => {
        let payloadObj;
        try {
            payloadObj = JSON.parse(payload);
        } 
        catch (e) {
            socket.emit("game_error", JSON.stringify({"game_error": "Invalid json format"}));
            return;
        }
        let room = rooms.get(payloadObj.roomcode);
        if (!room) {
            socket.emit("game_error", JSON.stringify({"game_error": "Roomcode does not exist"}));
            return;
        }
        if (!("player" in payloadObj)) {
            socket.emit("game_error", JSON.stringify({"game_error": "player missing from json object"}));
            return;
        }
        let votedPlayer = room.selectedPlayers[payloadObj.player];
        votedPlayer.score++;
        let percentage = room.getDisplayPercentage();
        let res = { percentage };
        io.to(payloadObj.roomcode).emit("vote", JSON.stringify(res));
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

/**
 * Returns a unique, random room code
 */
function getRandomRoomCode() {
    let roomCode;
    let char;

    do{
        roomCode = ""; //reset the room code

        for(let i = 0; i < 4; i=i+1)
        {
            //get random ascii char from A-Z
            char = 65 + Math.floor(Math.random() * 26);

            //add it to the roomcode string
            roomCode += String.fromCharCode(char);
        }

    } while(rooms.has(roomCode)); //loop until the room code is unique

    return roomCode;
}