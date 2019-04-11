var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

const countQuery = 'SELECT count(distinct fname) FROM Sells';

const orderNameAsc = ' ORDER BY S.rname ASC';
const orderNameDesc = ' ORDER BY S.rname DESC';

const defaultQuery = 'SELECT S.rname, S.fname, F.cname, CASE WHEN (RP.discount IS NULL) THEN S.price ELSE CAST(S.price * RP.discount/100 AS NUMERIC(5,2)) END as price'
+ ' FROM (Sells S NATURAL JOIN Food F) NATURAL LEFT JOIN RestaurantPromos RP';

const defaultOrder = orderNameAsc;

var prevQuery = defaultQuery;

function render(req, res, next, sql_query_display, sql_query_order) {

	var type = req.session.auth.type;

	prevQuery = sql_query_display;

	sql_query_display += sql_query_order;

	pool.query(countQuery, (err, data) => {
		total_food = data.rows;
		pool.query(sql_query_display, (err, data) => {
			res.render('menu', { title: 'Menu', data: data.rows, total: total_food, type: type });
		})
	});
}

router.get('/search', function(req, res, next) {
	var newQuery = '';

	if (req.query.rname == '') {
		newQuery = prevQuery;
	} else {
		var restaurant = ' \'\%' + req.query.rname.toLowerCase() + '\%\'';
		newQuery = defaultQuery + ' WHERE lower(S.rname) LIKE' + restaurant;
	}

	var newOrder = '';

	if (req.query.order == 'nameAsc') {
		newOrder = orderNameAsc;
	} else if (req.query.order == 'nameDesc') {
		newOrder = orderNameDesc;
	} else {
		newOrder = defaultOrder;
	}

	render(req, res, next, newQuery, newOrder);
});

router.get('/', function(req, res, next) {
	render(req, res, next, defaultQuery, defaultOrder);
});

module.exports = router;
