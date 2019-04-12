var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {

	var type = req.session.auth.type;

	var ongoing_query = 'SELECT rname, discount, startDate, endDate,'
	+ ' CASE WHEN (startDate <= CURRENT_DATE AND CURRENT_DATE <= endDate) THEN 1 ELSE 0 END as ongoing'
	+ ' FROM RestaurantPromos';

    var sql_query = 'SELECT rname as rname, discount as discount, startDate as start, endDate as end from RestaurantPromos';
	
	pool.query(ongoing_query, (err, data) => {
		res.render('promos', { title: 'Promotions', data: data.rows , type: type});
	});
});

module.exports = router;