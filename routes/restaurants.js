var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

const countQuery = 'SELECT count(*) FROM RestaurantAreas';

const orderNameAsc = ' ORDER BY rname ASC';
const orderNameDesc = ' ORDER BY rname DESC';
const orderScoreAsc = ' ORDER BY score ASC';
const orderScoreDesc = ' ORDER BY score DESC';

const defaultQuery = 'SELECT RA.rname as rname, S.cname as cname, RA.aname as aname, RA.address as address,'
+ ' COALESCE((SELECT AVG(score) FROM rates where rname = RA.rname), 0) as score,'
+ ' RA.startTime as start, RA.endTime as end'
+ ' FROM RestaurantAreas RA natural join Serves S';
const defaultOrder = orderNameAsc;

var prevQuery = defaultQuery;

function render(req, res, next, sql_query_display, sql_query_order) {
	prevQuery = sql_query_display;

	sql_query_display += sql_query_order;

	pool.query(countQuery, (err, data) => {
		total_restaurants = data.rows;
		pool.query(sql_query_display, (err, data) => {
			res.render('restaurants', { title: 'Participating Outlets', data: data.rows, total: total_restaurants });
		})
	});
}

router.get('/search', function(req, res, next) {
	var newQuery = '';

	if (req.query.rname == '') {
		newQuery = prevQuery;
	} else {
		var restaurant = ' \'\%' + req.query.rname.toLowerCase() + '\%\'';
		newQuery = defaultQuery + ' WHERE lower(RA.rname) LIKE' + restaurant;
	}

	var newOrder = '';

	if (req.query.order == 'nameAsc') {
		newOrder = orderNameAsc;
	} else if (req.query.order == 'nameDesc') {
		newOrder = orderNameDesc;
	} else if (req.query.order == 'scoreAsc') {
		newOrder = orderScoreAsc;
	} else if (req.query.order == 'scoreDesc') {
		newOrder = orderScoreDesc;
	} else {
		newOrder = defaultOrder;
	}

	render(req, res, next, newQuery, newOrder);
});

router.get('/', function(req, res, next) {
	render(req, res, next, defaultQuery, defaultOrder);
});

module.exports = router;
