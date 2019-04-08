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
     * Get and return a random category, while also removing it from the categories array
     * @returns {String} the category
     */
    getAndRemoveRandomCategory() {
        let remIndex = parseInt(Math.random() * this.categories.length);
        return this.categories.splice(remIndex, 1)[0];
    }
}
module.exports = Room;