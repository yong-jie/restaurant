var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {
  var sql_query = 'SELECT * FROM reservations';
	pool.query(sql_query, (err, data) => {
		res.render('reservations', { title: 'List of Reservations', data: data.rows });
	});
});

module.exports = router;
