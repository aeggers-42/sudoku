var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Puzzle = require("../models/puzzle");

/* POST puzzle listing. */
router.post('/', function (req, res, next) {
  let puzzle;
  try {
    puzzle = new Puzzle(req.body);
    let changed = true;
    let before = _.cloneDeep(puzzle.rows);

    while (changed) {
      puzzle.processRows();

      puzzle.processColumns();

      puzzle.processSquares();

      changed = false;
      for (let rowIdx = 0; rowIdx < puzzle.rows.length; rowIdx++) {
        for (let colIdx = 0; colIdx < puzzle.rows[0].length; colIdx++) {
          let valBefore = before[rowIdx][colIdx];
          let valAfter = puzzle.rows[rowIdx][colIdx];
          if ((Array.isArray(valBefore) && Array.isArray(valAfter) && _.difference(valBefore, valAfter).length > 0) ||
            (!Array.isArray(valBefore) && !Array.isArray(valAfter) && valBefore !== valAfter)) {
            changed = true;
            break;
          }
        }
      }
      before = _.cloneDeep(puzzle.rows);
    }


    if (puzzle.puzzleSolved()) {
      console.log('Whoo! Solved!');
    }
    puzzle.print(puzzle.rows);

    res.send('respond with a resource');
  } catch (e) {
    console.log(`Caught an error ${e}`);
    res.send(`Caught an error in validation ${e}`);
  }
});

module.exports = router;
