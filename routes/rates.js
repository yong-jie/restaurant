var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

/* SQL Query */
var sql_query = 'INSERT INTO rates VALUES';

// GET
router.get('/', function(req, res, next) {
	res.render('rates', { title: 'Restaurant' });
});

// POST
router.post('/', function(req, res, next) {
    // Retrieve Information
    
	var rname    = req.body.rname;
	var aname	 = req.body.aname;
	var username  = req.body.username;
	var comment = req.body.comment;
	var score = req.body.score;
	
    // Construct Specific SQL Query
    var insert_query = sql_query + "('" + rname + "','" + aname + "','" + username + "','" + comment + "','" + score + "')";
	
	pool.query(insert_query, (err, data) => {
		res.redirect('/ratings')
	});
});

module.exports = router;
