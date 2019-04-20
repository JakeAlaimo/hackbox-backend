class Score
{
    constructor() {

        this.scoreOverTime = [0,0,0,0,0]; //keeps track of scores spanning the last 5 seconds
    }

    AddPoint()
    {
        this.scoreOverTime[0] += 1; //add a single point to this current second's score total
    }

    //return the combined value of points over the last 5 seconds
    SumPoints()
    {
        let sum = 0;

        for(let i = 0; i < this.scoreOverTime.length; i++)
        {
            sum += this.scoreOverTime[i];
        }

        return sum;
    }

    //Called every second. Move each score counter over a second.
    ShiftScores()
    {
        //each index pulls the value from the previous index. This results in the loss of the final index's value
        for(let i = this.scoreOverTime.length - 1; i > 0; i--)
        {
            this.scoreOverTime[i] = this.scoreOverTime[i-1];
        }

        this.scoreOverTime[0] = 0; //reset the value of the current second

    }

};

module.exports = Score;