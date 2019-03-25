var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

// GET
router.get('/', function(req, res, next) {
	res.render('recommend', { title: 'Modifying Database' });
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var food_1 = req.body.food_1;
	var food_2 = req.body.food_2;
	var food_3 = req.body.food_3;
	var area = req.body.area;
	var cuisine = req.body.cuisine;
	
	var sql_query = "";

	// Construct Specific SQL Query
	var insert_query = sql_query + "('" + matric + "','" + name + "','" + faculty + "')";
	
	pool.query(insert_query, (err, data) => {
		res.redirect('/recommendation')
	});
});

module.exports = router;
