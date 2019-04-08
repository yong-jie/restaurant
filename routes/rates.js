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
	var raid = 'SELECT COUNT(*) as c'
	+ ' FROM Rates';
	

    // Construct Specific SQL Query
	pool.query(raid, (err, data) => {
		numRates = data.rows[0].c;
		var dateTime = 'SELECT LOCALTIMESTAMP as t;';
		pool.query(dateTime, (err, data) => {
			var currentTime = data.rows[0].t.toISOString().replace('Z', '').replace('T', ' ');
			var insert_query = sql_query + "('" + numRates + "','" + currentTime + "','" + rname + "','" + aname + "','" + username + "','" + comment + "','" + score + "')";
			pool.query(insert_query, (err, data) => {
				res.redirect('/ratings')
			});
		});
	});
});

module.exports = router;
