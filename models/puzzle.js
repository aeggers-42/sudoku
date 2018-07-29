var _ = require('lodash');


module.exports = class Puzzle {

    constructor(initialPuzzle) {

        console.log(`Got the puzzle? ${JSON.stringify(initialPuzzle)}`);

        // ToDo: Validation

        this.puzzle = initialPuzzle;

        this.rows = initialPuzzle.puzzle;

        // for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
            // console.log(`The rowIdx is ${rowIdx}`);
            // let row = this.rows[rowIdx];
            // console.log(`The row is ${row}`);
        // }

        // console.log(`Do we have any rows?!!??! ${JSON.stringify(this.rows)}`);
    }

    getEntry(row, col) {
        return this.puzzle[row][col];
    }

    processRows() {
        // let retval = _.cloneDeep(puzzle);

        for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
            this.rows[rowIdx] = this.processEntries(this.rows[rowIdx]);
        }

        // return retval;
    }

    processColumns() {
        // let retval = _.cloneDeep(puzzle);

        for (let colIdx = 0; colIdx < this.rows[0].length; colIdx++) {
            let column = [];
            for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
                let row = this.rows[rowIdx];
                column.push(row[colIdx]);
            }

            let processedCol = this.processEntries(column);

            for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
                this.rows[rowIdx][colIdx] = processedCol[rowIdx];
            }
        }

        // return retval;
    }


    createSquaresArray() {
        let squaresArray = [];

        for (let rowIdx = 0; rowIdx <= this.rows.length - 3; rowIdx += 3) {
            let row = this.rows[rowIdx];
            let rowPlusOne = this.rows[rowIdx + 1];
            let rowPlusTwo = this.rows[rowIdx + 2];

            for (let colIdx = 0; colIdx <= row.length - 3; colIdx += 3) {
                let squareValues = [];
                squareValues.push(row[colIdx]);
                squareValues.push(row[colIdx + 1]);
                squareValues.push(row[colIdx + 2]);

                squareValues.push(rowPlusOne[colIdx]);
                squareValues.push(rowPlusOne[colIdx + 1]);
                squareValues.push(rowPlusOne[colIdx + 2]);

                squareValues.push(rowPlusTwo[colIdx]);
                squareValues.push(rowPlusTwo[colIdx + 1]);
                squareValues.push(rowPlusTwo[colIdx + 2]);

                squaresArray.push(squareValues);
            }
        }

        // console.log(`The squaresArray ${JSON.stringify(squaresArray)}`);

        return squaresArray;
    }

    processSquares() {
        // let retval = _.cloneDeep(puzzle);
        let squaresArray = this.createSquaresArray();
        let processedSquares = [];
        for (let squareIdx = 0; squareIdx < squaresArray.length; squareIdx++) {
            processedSquares.push(this.processEntries(squaresArray[squareIdx]));
        }

        // this.print(processedSquares);

        for (let squareIdx = 0; squareIdx < squaresArray.length; squareIdx++) {
            let square = processedSquares[squareIdx];

            for (let cellIdx = 0; cellIdx < square.length; cellIdx++) {
                let rowCol = this.squareCellToRowColumn(squareIdx, cellIdx);
                // console.log(`The rowCol is ${JSON.stringify(rowCol)}`);
                this.rows[rowCol.row][rowCol.col] = square[cellIdx];
            }
        }

        // console.log('The processed squares are');
        // this.print(retval);

        // return retval;
    }

    squareCellToRowColumn(squareIdx, cellIdx) {
        // [0][5] in square coordinates corresponds to row column [1][1]
        // [6][8] in square coordinates corresponds to row column [8][1]

        let row = Math.floor(squareIdx / 3) * 3 + Math.floor(cellIdx / 3);
        let col = squareIdx % 3 * 3 + cellIdx % 3;

        // console.log(`The squareIdx is ${squareIdx} the cellIdx is ${cellIdx} the row ${row} the col ${col}`);
 
        return {
            row: row,
            col: col
        };
    }


    // processRows and processColumns does pretty much exactly the same thing
    // so that should be refactored into its own function
    processEntries(entrySet) {
        // console.log(`The entrySet before ${JSON.stringify(entrySet)}`);
        let retval = _.cloneDeep(entrySet);
        const standard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        // entrySet is an array with a length of 9, and it represents values that should be unique

        let potential = _.difference(standard, _.filter(retval, entry => entry !== "X" && !Array.isArray(entry)));
        potential = potential.length === 1 ? potential[0] : potential;

        for (let entryIdx = 0; entryIdx < retval.length; entryIdx++) {
            const entry = retval[entryIdx];
            if (entry === "X" || Array.isArray(entry)) {
                retval[entryIdx] = this.mergePotentials(entry, potential);
            }
        }

        // console.log(`And after ${JSON.stringify(retval)}`);

        return retval;
    }


    mergePotentials(cellPotentials, entryPotentials) {
        // let retval = _.cloneDeep(processedRowsArray);

        // for (let rowIdx = 0; rowIdx < processedRowsArray.length; rowIdx++) {
            // let processedRowsRow = processedRowsArray[rowIdx];
            // let processedColumnsRow = processedColumnsArray[rowIdx];
            // for (let colIdx = 0; colIdx < processedRowsRow.length; colIdx++) {
                if (Array.isArray(cellPotentials) && Array.isArray(entryPotentials)) {
                    if (cellPotentials.length === 1) {
                        return cellPotentials[0];
                    } else if (entryPotentials.length === 1) {
                        return entryPotentials[0];
                    } else {
                        let reducedPotential = _.intersection(cellPotentials, entryPotentials);
                        if (reducedPotential.length === 1) {
                            return reducedPotential[0];
                        } else {
                            return reducedPotential;
                        }
                    }
                } else if (Array.isArray(cellPotentials) && !Array.isArray(entryPotentials) && entryPotentials !== 'X') {
                    return entryPotentials;
                } else if (Array.isArray(cellPotentials) && !Array.isArray(entryPotentials) && entryPotentials === 'X') {
                    return cellPotentials;
                } else if (!Array.isArray(cellPotentials) && cellPotentials !== 'X' && Array.isArray(entryPotentials)) {
                    return cellPotentials;
                } else if (!Array.isArray(cellPotentials) && cellPotentials === 'X' && Array.isArray(entryPotentials)) {
                    return entryPotentials;
                }
            // }
        // }

        console.log(`The rows at the end are ${retval.length}`);
        for (let row of retval) {
            console.log(`The cols are ${row.length}`);
        }

        return retval;
    }



    print(puzzle) {
        // console.log('\n');
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