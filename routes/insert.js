var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

/* SQL Query */
var sql_query = 'INSERT INTO reservations VALUES';

// GET
router.get('/', function(req, res, next) {
	res.render('insert', { title: 'Restaurant' });
});

// POST
router.post('/', function(req, res, next) {
    // Retrieve Information
    
	var rname    = req.body.rname;      //can only add rname that already exists in the db
	var username  = req.body.username;  //can only add username that already exist in the db
	var numPax = req.body.numPax;       //integer
	var confirmed = req.body.confirmed; //True or False
	var amount = req.body.amount;
	var startTime = req.body.startTime;
	var endTime = req.body.endTime;
	
    // Construct Specific SQL Query
    var insert_query = sql_query + "('" + rname + "','" + username + "','" + numPax + "','" + confirmed + "','"
    + amount + "','" + startTime + "','" + endTime + "')";
	
	pool.query(insert_query, (err, data) => {
		res.redirect('/reservations')
	});
});

module.exports = router;
