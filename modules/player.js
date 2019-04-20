const Score = require("./score");

class Player {
    constructor(username) {
        this.username = username;
        this.score = new Score();
    }
}
module.exports = Player;