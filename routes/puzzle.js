var express = require('express');
var router = express.Router();
var Puzzle = require("../models/puzzle");

/* POST puzzle listing. */
router.post('/', function(req, res, next) {
    console.log(`Got a puzzle? ${JSON.stringify(req.body)}`);
    var puzzle = new Puzzle(req.body);
    console.log('Attempting to print a puzzle');
    puzzle.print();
  res.send('respond with a resource');
});

module.exports = router;
