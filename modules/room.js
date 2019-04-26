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
        this.playedplayer = []; // Array of played player indexes
        this.startLifetime = 20;
        this.resetLifetime(); // In seconds TODO make this customizable
        this.inProgress = false;
        this.temp=[];
    }

    resetLifetime() {
        this.lifetime = this.startLifetime;
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
        this.selectedPlayers = [];
        this.temp = this.players.filter(player=> !this.playedplayer.includes(player));
        //this.temp is the unselected player list
        if (this.temp.length <2){
        // if the unselected player is less than 2 people
            this.playedplayer=[];// reset the playedplayer list
            this.temp = this.players.filter(player=> !this.playedplayer.includes(player));
        }

        for (let i = 0; i < 2; ++i) {
            let randI = parseInt(Math.random() * this.temp.length);
            var tempPlayer = this.temp[randI];
            // double check the player is not int played list, in fact it should never
            // get into this while loop
            while(this.playedplayer.includes(tempPlayer)){
                randI = parseInt(Math.random() * this.temp.length);
                tempPlayer = this.temp[randI];
            }

            this.selectedPlayers.push(this.temp[randI]);
            this.playedplayer.push(this.temp[randI]);
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
