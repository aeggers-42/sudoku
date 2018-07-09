var express = require('express');
var router = express.Router();
var Puzzle = require("../models/puzzle");

/* POST puzzle listing. */
router.post('/', function(req, res, next) {
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
  res.send('respond with a resource');
});

module.exports = router;
