var _ = require('lodash');

const allowedChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'];

module.exports = class Puzzle {

    constructor(initialPuzzle) {
        this.rows = initialPuzzle.puzzle;
        this.validate();
    }

    validate() {
        // Check that we have the right number of rows
        if (this.rows.length !== 9) {
            throw `Wrong number of rows. Should be 9 but there's actually ${this.rows.length}`;
        }

        // Check that we have the right number of columns
        for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
            let row = this.rows[rowIdx];
            if (row.length !== 9) {
                throw `Wrong number of columns in row ${rowIdx}. Should be 9, but there's actually ${row.length}`;
            }
        }

        // Check that the rows don't have dups and that all characters are legal
        for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
            let row = _.cloneDeep(this.rows[rowIdx]);
            let rowNoXs = _.remove(row, entry => entry !== 'X');
            if (_.uniq(rowNoXs).length !== rowNoXs.length) {
                throw `Row ${rowIdx} has duplicate entries`;
            }

            for (let entry of this.rows[rowIdx]) {
                if (allowedChars.indexOf(entry) === -1) {
                    throw `Row ${rowIdx} contains an illegal character`;
                }
            }

        }

        // Check that the columns don't have dups and that all characters are legal
        for (let colIdx = 0; colIdx < this.rows[0].length; colIdx++) {
            let column = [];
            for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
                let row = _.cloneDeep(this.rows[rowIdx]);
                column.push(row[colIdx]);
            }

            let columnNoXs = _.remove(column, entry => entry !== 'X');
            if (_.uniq(columnNoXs).length !== columnNoXs.length) {
                throw `Column ${colIdx} has duplicate entries ${JSON.stringify(_.uniq(columnNoXs))} ${JSON.stringify(columnNoXs)}`;
            }

            for (let entry of column) {
                if (allowedChars.indexOf(entry) === -1) {
                    throw `Column ${colIdx} contains an illegal character`;
                }
            }
        }

        // Check that squares don't have dups and that all characters are legal
        let squaresArray = this.createSquaresArray();
        for (let squareIdx = 0; squareIdx < squaresArray.length; squareIdx++) {
            let square = squaresArray[squareIdx];
            let squareNoXs = _.remove(square, entry => entry !== 'X');
            if (_.uniq(squareNoXs).length !== squareNoXs.length) {
                throw `Square ${squareIdx} has duplicate entries. Note: Squares are numbererd left to right, top to bottom`;
            }

            for (let entry of square) {
                if (allowedChars.indexOf(entry) === -1) {
                    throw `Square ${squareIdx} contains an illegal character. Note: Squares are numbered left to right, top to bottom`;
                }
            }
        }
    }

    processRows() {
        for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
            this.rows[rowIdx] = this.processEntries(this.rows[rowIdx]);
        }
    }

    processColumns() {
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

        return squaresArray;
    }

    processSquares() {
        let squaresArray = this.createSquaresArray();
        let processedSquares = [];
        for (let squareIdx = 0; squareIdx < squaresArray.length; squareIdx++) {
            processedSquares.push(this.processEntries(squaresArray[squareIdx]));
        }

        for (let squareIdx = 0; squareIdx < squaresArray.length; squareIdx++) {
            let square = processedSquares[squareIdx];

            for (let cellIdx = 0; cellIdx < square.length; cellIdx++) {
                let rowCol = this.squareCellToRowColumn(squareIdx, cellIdx);
                this.rows[rowCol.row][rowCol.col] = square[cellIdx];
            }
        }
    }

    squareCellToRowColumn(squareIdx, cellIdx) {

        let row = Math.floor(squareIdx / 3) * 3 + Math.floor(cellIdx / 3);
        let col = squareIdx % 3 * 3 + cellIdx % 3;

        return {
            row: row,
            col: col
        };
    }

    processEntries(entrySet) {
        let retval = _.cloneDeep(entrySet);
        const standard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        let potential = _.difference(standard, _.filter(retval, entry => entry !== "X" && !Array.isArray(entry)));
        potential = potential.length === 1 ? potential[0] : potential;

        for (let entryIdx = 0; entryIdx < retval.length; entryIdx++) {
            const entry = retval[entryIdx];
            if (entry === "X" || Array.isArray(entry)) {
                retval[entryIdx] = this.mergePotentials(entry, potential);
            }
        }

        return retval;
    }


    mergePotentials(cellPotentials, entryPotentials) {
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

        return retval;
    }



    print() {
        for (let row of this.rows) {
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

    getColumn(colIndex) {
        let retval = [];
        for (const row of this.rows) {
            retval.push(row[colIndex]);
        }
        return retval;
    }

    getSquare(squareIdx) {
        let retval = [];
        // Need to transform squareIndex to row column top left space in each square
        let startRow = Math.floor(squareIdx / 3) * 3;
        let startCol = squareIdx % 3 * 3;
        console.log(`The startRow is ${startRow} and the startCol is ${startCol}`);
        for (let row = startRow; row < startRow + 3; row++) {
            for (let col = startCol; col < startCol + 3; col++) {
                retval.push(this.rows[row][col]);
            }
        }
        console.log('The square is ', retval);
        return retval;
    }

    puzzleSolved() {
        // Need to check that all the spaces are filled in, each row, column, and square only uses each of the numbers 1-9 once
        // If, at any point, we encounter an invalid row, column or square, return false
        // Seems like, we should just be able to get the unique count of each row, column or square, and if it's not equal to 9, return false
        // This is going to fail if the puzzle isn't solved, but has unique arrays of options...
        for (const row of this.rows) {
            if (_.intersection(row, allowedChars.slice(0, 9)).length !== 9) {
                return false;
            }
        }

        for (let colIdx = 0; colIdx < 9; colIdx++) {
            let column = this.getColumn(colIdx);
            if (_.intersection(column, allowedChars.slice(0, 9)).length !== 9) {
                return false;
            }
        }

        for (let squareIdx = 0; squareIdx < 9; squareIdx++) {
            let square = this.getSquare(squareIdx);
            if (_.intersection(square, allowedChars.slice(0, 9)).length !== 9) {
                return false;
            }
        }
        return true;
    }
};