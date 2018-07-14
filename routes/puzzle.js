var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Puzzle = require("../models/puzzle");

/* POST puzzle listing. */
router.post('/', function (req, res, next) {
  console.log(`Got a puzzle? ${JSON.stringify(req.body)}`);
  let puzzle = new Puzzle(req.body);
  console.log('Attempting to print a puzzle');
  puzzle.print(puzzle.rows);

  let processedRowPuzzle = puzzle.processRows();
  console.log('After processing rows');
  puzzle.print(processedRowPuzzle);

  let processedColPuzzle = puzzle.processColumns();
  console.log('After processing columns');
  puzzle.print(processedColPuzzle);

  let mergedPuzzle = puzzle.mergeRowAndColumnPotentials(processedRowPuzzle, processedColPuzzle);
  console.log('After merging the row and column results');
  puzzle.print(mergedPuzzle);

  let changed = true;
  let before = _.cloneDeep(puzzle.rows);

  while (changed) {
    let rows = puzzle.processRows();
    let cols = puzzle.processColumns();
    let merged = puzzle.mergeRowAndColumnPotentials(rows, cols);
    puzzle.rows = merged;
    changed = false;
    for (let rowIdx = 0; rowIdx < puzzle.rows.length; rowIdx++) {
      for (let colIdx = 0; colIdx < puzzle.rows[0].length; colIdx++) {
        let valBefore = before[rowIdx][colIdx];
        let valAfter = puzzle.rows[rowIdx][colIdx];
        if ((Array.isArray(valBefore) && Array.isArray(valAfter) && _.difference(valBefore, valAfter).length > 0) ||
          (!Array.isArray(valBefore) && !Array.isArray(valAfter) && valBefore !== valAfter)) {

          console.log(`Frickin valBefore ${JSON.stringify(valBefore)} and frickin' valAfter ${JSON.stringify(valAfter)} and frickin difference ${_.difference(valBefore, valAfter).length}`);
          changed = true;
          break;
        }
      }
    }

    before = _.cloneDeep(puzzle.rows);
  }



  console.log('Printing the rows after all processing has been completed');
  puzzle.print(puzzle.rows);


  //   puzzle.rows = mergedPuzzle;
  //   console.log('After setting the rows to the merged result, the rows puzzle rows are');
  //   puzzle.print(puzzle.rows);

  // let secondProcessedRowPuzzle = puzzle.processRows();
  // console.log('After processing rows a second time');
  // puzzle.print(secondProcessedRowPuzzle);

  // let secondProcessedColPuzzle = puzzle.processColumns();
  // console.log('After processing columns a second time');
  // puzzle.print(secondProcessedColPuzzle);

  // let secondMergedPuzzle = puzzle.mergeRowAndColumnPotentials(secondProcessedRowPuzzle, secondProcessedColPuzzle);
  // console.log('After merging a second time');
  // puzzle.print(secondMergedPuzzle);

  // puzzle.rows = secondMergedPuzzle;

  // let thirdProcessedRowPuzzle = puzzle.processRows();
  // console.log('After processing rows a third time');
  // puzzle.print(thirdProcessedRowPuzzle);

  // let thirdProcessedColPuzzle = puzzle.processColumns();
  // console.log('After processing columns a second time');
  // puzzle.print(thirdProcessedColPuzzle);

  // let thirdMergedPuzzle = puzzle.mergeRowAndColumnPotentials(thirdProcessedRowPuzzle, thirdProcessedColPuzzle);
  // console.log('After merging a third time');
  // puzzle.print(thirdMergedPuzzle);

  res.send('respond with a resource');
});

module.exports = router;
