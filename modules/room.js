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
        this.lifetime = 60; // In seconds TODO make this customizable
    }
    
    
    hasPlayer(username) {
        return this.players.filter(player => player.username == username).length == 1;
    }

    /**
     * Selects the two players. After this is called, selectedPlayers will be up to date.
     * @return {Player[]} The selected players
     */
    selectPlayers() {
        let indexes = this.players.map((p, i) => i);
        let selectedIndexes = [];
        for (let i = 0; i < 2; ++i) {
            let randI = parseInt(Math.random() * indexes.length);
            selectedIndexes.push(indexes[randI]);
            indexes.splice(randI, 1);
        }        
        this.selectedPlayers = selectedIndexes.map(index => this.players[index]);
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
        const [score1, score2] = this.selectedPlayers.map(player => player.score.SumPoints());
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