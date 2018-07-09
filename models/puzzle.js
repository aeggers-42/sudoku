var _ = require('lodash');



// rows = [];
// cols = [[],[],[],[],[],[],[],[],[]];
// puzzle = [];

module.exports = class Puzzle {

    constructor(initialPuzzle) {

        console.log(`Got the puzzle? ${JSON.stringify(initialPuzzle)}`);

        // ToDo: Validation

        this.puzzle = initialPuzzle;

        this.rows = initialPuzzle.puzzle;

        for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
            console.log(`The rowIdx is ${rowIdx}`);
            let row = this.rows[rowIdx];
            console.log(`The row is ${row}`);
            // for (let col = 0; col < row.length; col++) {
            //     console.log(`The col is ${col} and the value is ${row[col]}`);
            //     if (!this.cols) {
            //         this.cols = [];
            //     }

            //     if (!this.cols[col]) {
            //         this.cols[col] = [];
            //     }
            //     this.cols[col] = row[col];
            // }
        }

        console.log(`Do we have any rows?!!??! ${JSON.stringify(this.rows)}`);
        // console.log(`Do we have any columns?!?! ${JSON.stringify(this.cols)}`);
    }

    // getRow (row) {
    //     return this.rows[row];
    // }

    // getCol (col) {
    //     return this.cols[col];
    // }

    getEntry(row, col) {
        return this.puzzle[row][col];
    }

    processRows() {
        let retval = _.cloneDeep(this.rows);
        let standard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        for (let rowIdx = 0; rowIdx < retval.length; rowIdx++) {
            let row = retval[rowIdx];
            let current = [];
            for (let col = 0; col < row.length; col++) {
                current.push(row[col]);
            }
            let potential = _.difference(standard, current);

            console.log(potential);

            for (let col = 0; col < row.length; col++) {
                if (row[col] === "X") {
                    retval[rowIdx][col] = potential;
                }
            }
            // this.rows[rowIdx] = row;
        }
        return retval;
    }

    processColumns() {
        let retval = _.cloneDeep(this.rows);

        console.log(`The retval, after cloning deep is ${retval}`);

        let standard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        for (let colIdx = 0; colIdx < retval[0].length; colIdx++) {
            let current = [];
            for (let rowIdx = 0; rowIdx < retval.length; rowIdx++) {
                let row = retval[rowIdx];

                let col = row[colIdx];
                if (col !== "X") {
                    current.push(row[colIdx]);
                }
            }

            let potential = _.difference(standard, current);

            for (let rowIdx = 0; rowIdx < retval.length; rowIdx++) {
                let row = retval[rowIdx];

                let colValue = row[colIdx];
                console.log(`The colValue is ${colValue}`);
                if (colValue === "X") {
                    console.log('Getting here?!?!?');
                    retval[rowIdx][colIdx] = potential;
                } 
            }
        }

        return retval;
    }

    print(puzzle) {
        console.log('\n');
        for (let row of puzzle) {
            let logStr = '';
            for (let col = 0; col < row.length; col++) {
                if (typeof row[col] === 'object') {
                    logStr += '[' + row[col] + ']';
                } else {
                    logStr += row[col];
                }

                if (col !== row.length - 1) {
                    logStr += ' ';
                }
            }
            console.log(logStr);
        }
    }
};