

rows = [];
cols = [[],[],[],[],[],[],[],[],[]];
puzzle = [];

module.exports = class Puzzle {
        
    constructor(initialPuzzle) {

        console.log(`Got the puzzle? ${JSON.stringify(initialPuzzle)}`);
        
        // Validation

        puzzle = initialPuzzle;
        
        this.rows = initialPuzzle.puzzle;
        
        for (let rowIdx = 0; rowIdx < initialPuzzle.length; rowIdx++) {
            console.log(`The rowIdx is ${rowIdx}`);
            let row = initialPuzzle[rowIdx];
            console.log(`The row is ${row}`);
            for (let col = 0; col < row.length; col++) {
                console.log(`The col is ${col} and the value is ${row[col]}`);
                cols[col] = row[col];
            }
        }

        console.log(`Do we have any rows?!!??! ${JSON.stringify(this.rows)}`);
    }

    getRow (row) {
        return rows[row];
    }
    
    getCol (col) {
        return cols[col];
    }

    getEntry (row, col) {
        return puzzle[row][col];
    }

    print () {
        console.log('\n');
        for (let row of this.rows) {
            let logStr = '';
            for (var col = 0; col < row.length; col++) {
                logStr += row[col];
                if (col !== row.length - 1) {
                    logStr += ' ';
                }
            }
            console.log(logStr);
        }
    }
};