var _ = require('lodash');


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
        }

        console.log(`Do we have any rows?!!??! ${JSON.stringify(this.rows)}`);
    }

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
                if (row[col] !== "X" && !Array.isArray(row[col])) {
                    current.push(row[col]);
                }
            }
            let potential = _.difference(standard, current);

            for (let col = 0; col < row.length; col++) {
                if (row[col] === "X" || Array.isArray(row[col])) {
                    if (potential.length === 1) {
                        retval[rowIdx][col] = potential[0];
                    } else {
                        retval[rowIdx][col] = potential;
                    }
                }
            }
        }
        return retval;
    }

    processColumns() {
        let retval = _.cloneDeep(this.rows);
        let standard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        for (let colIdx = 0; colIdx < retval[0].length; colIdx++) {
            let current = [];
            for (let rowIdx = 0; rowIdx < retval.length; rowIdx++) {
                let row = retval[rowIdx];

                let col = row[colIdx];
                if (col !== "X" && !Array.isArray(col)) {
                    current.push(row[colIdx]);
                }
            }

            let potential = _.difference(standard, current);

            for (let rowIdx = 0; rowIdx < retval.length; rowIdx++) {
                let row = retval[rowIdx];

                let colValue = row[colIdx];
                if (colValue === "X" || Array.isArray(colValue)) {
                    if (potential.length === 1) {
                        retval[rowIdx][colIdx] = potential[0];
                    } else {
                        retval[rowIdx][colIdx] = potential;
                    }
                } 
            }
        }

        return retval;
    }


    // processRows and processColumns does pretty much exactly the same thing
    // so that should be refactored into its own function
    processEntries(startIdx, endIdx) {

    }


    mergeRowAndColumnPotentials(processedRowsArray, processedColumnsArray) {
        let retval = _.cloneDeep(processedRowsArray);

        for (let rowIdx = 0; rowIdx < processedRowsArray.length; rowIdx++) {
            let processedRowsRow = processedRowsArray[rowIdx];
            let processedColumnsRow = processedColumnsArray[rowIdx];
            for (let colIdx = 0; colIdx < processedRowsRow.length; colIdx++) {
                if (typeof processedRowsRow[colIdx] === 'object') {
                    let reducedPotential = _.intersection(processedRowsRow[colIdx], processedColumnsRow[colIdx]);
                    if (reducedPotential.length === 1) {
                        retval[rowIdx][colIdx] = reducedPotential[0];
                    } else {
                        retval[rowIdx][colIdx] = reducedPotential;
                    }
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