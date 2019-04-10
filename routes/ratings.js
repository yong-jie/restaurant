var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {
  var sql_query = 'SELECT raid, rname, aname, address, username, comment, score, dateTime as dt FROM rates';
	pool.query(sql_query, (err, data) => {
		res.render('ratings', { title: 'List of Reservations rating', data: data.rows });
	});
});

module.exports = router;
