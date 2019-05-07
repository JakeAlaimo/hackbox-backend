const Player = require("./player");
/**
 * Structure which describes a room
 */
class Room {
    /**
     * Create a new room
     * @param {String} code room code
     * @param {String[]} categories array of possible categories
     */
    constructor(code, categories) {
        this.code = code;
        this.categories = categories;
        this.players = []; // Array of player objects
        this.selectedPlayers = []; // Array of selected player indexes
        this.playedplayers = []; // Array of played player indexes
        this.startLifetime = 30;
        this.resetLifetime(); // In seconds TODO make this customizable
        this.inProgress = false;
        this.unselectedPlayers=[];
    }

    /**
     * Resets the lifetime of the room
     */
    resetLifetime() {
        this.lifetime = this.startLifetime;
    }


    /**
     * Returns true if this room has the provided username, false otherwise
     * @param {String} username
     */
    hasPlayer(username) {
        return this.players.filter(player => player.username == username).length == 1;
    }

    /**
     * Selects the two players. After this is called, selectedPlayers will be up to date.
     * @return {Player[]} The selected players
     */
    selectPlayers() {
        this.selectedPlayers = [];
        this.unselectedPlayers = this.players.filter(player=> !this.playedplayers.includes(player));

        for (let i = 0; i < 2; ++i) {
            let randI = parseInt(Math.random() * this.unselectedPlayers.length);
            let curSelectedPlayer = this.unselectedPlayers[randI];
            this.selectedPlayers.push(curSelectedPlayer);
            this.playedplayers.push(curSelectedPlayer);

            this.unselectedPlayers.splice(this.unselectedPlayers.indexOf(curSelectedPlayer), 1);
            if (this.unselectedPlayers.length == 0) {
                this.playedplayers=[];// reset the playedplayer list
                this.playedplayers.push(curSelectedPlayer);
                this.unselectedPlayers = this.players.filter(player=> !this.playedplayers.includes(player));
            }
        }

        return this.selectedPlayers;
    }

    /**
     * Removes old points from each player's score
     */
    shiftScores(){

        for(let i = 0; i < this.players.length; i++)
        {
            this.players[i].score.ShiftScores();
        }

    }

    /**
     * Returns the display percentage based on the two selected players' scores
     */
    getDisplayPercentage() {
        // Array destructuring to extract player scores
        //const [score1, score2] = this.selectedPlayers.map(player => {player.score.SumPoints();});

        let score1 = this.selectedPlayers[0].score.SumPoints();
        let score2 = this.selectedPlayers[1].score.SumPoints();

        if (score1 == 0 && score2 == 0) {
            return .5;
        }
        return score2 / (score1 + score2);
    }

    /**
     * Get and return a random category, while also removing it from the categories array
     * @returns {String} the category
     */
    getAndRemoveRandomCategory() {
        let remIndex = parseInt(Math.random() * this.categories.length);
        return this.categories.splice(remIndex, 1)[0];
    }
}
module.exports = Room;
