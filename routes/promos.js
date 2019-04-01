var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {
    var sql_query = 'SELECT rname as rname, discount as discount, startDate as start, endDate as end from RestaurantPromos';
	pool.query(sql_query, (err, data) => {
		res.render('promos', { title: 'Promotions', data: data.rows });
	});
});

module.exports = router;