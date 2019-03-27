var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/search', function(req, res, next) {
	var total_restaurants = 0;
	var restaurant = "%" + req.query.rname.toLowerCase() + "%";
	var sql_query_display = 'SELECT L.rname as rname, L.aname as aname, L.address as address, S.cname as cname,'
	+ ' COALESCE((SELECT AVG(score) FROM rates where rname = L.rname), 0) AS score'
	+ ' FROM Located L natural join Serves S'
	+ ' WHERE lower(L.rname) LIKE $1'
	+ ' ORDER BY score DESC';
	var sql_query_count = 'SELECT count(*)'
	+ ' FROM Located L natural join Serves S';
	pool.query(sql_query_count, (err, data) => {
		total_restaurants = data.rows;
		pool.query(sql_query_display, [restaurant], (err, data) => {
			res.render('restaurants', { title: 'Participating Outlets', data: data.rows, total: total_restaurants });
		})
	});
});

router.get('/', function(req, res, next) {
	var total_restaurants = 0;
	var sql_query_display = 'SELECT L.rname as rname, L.aname as aname, L.address as address, S.cname as cname,'
	+ ' COALESCE((SELECT AVG(score) FROM rates where rname = L.rname), 0) AS score'
	+ ' FROM Located L natural join Serves S'
	+ ' ORDER BY score DESC';
	var sql_query_count = 'SELECT count(*)'
	+ ' FROM Located L natural join Serves S';
	pool.query(sql_query_count, (err, data) => {
		total_restaurants = data.rows;
		pool.query(sql_query_display, (err, data) => {
			res.render('restaurants', { title: 'Participating Outlets', data: data.rows, total: total_restaurants });
		});
	});
});

module.exports = router;
