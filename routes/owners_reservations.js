var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {

	var owner_username = req.session.auth.username;
	var owner_rname;

	var rnameQuery = 'SELECT rname FROM Owners WHERE username = $1';
    
    var reservationsQuery = 'SELECT reid, rname, aname, address, numPax, amount, dateTime'
    + ' FROM Reserves'
    + ' WHERE rname = $1 and amount = 0.00 and confirmed = true and dateTime <= LOCALTIMESTAMP;'

	pool.query(rnameQuery, [owner_username], (err, data) => {
		owner_rname = data.rows[0].rname;
		pool.query(reservationsQuery, [owner_rname], (err, data) => {
			res.render('owners_reservations', { title: 'Reservations', data: data.rows });
		});
	})
});

router.post('/', function(req, res, next) {
	
	var reid = req.body.reid;
	var amount = req.body.amount;
	
    var update_query = 'UPDATE Reserves SET amount = ' + amount + ' WHERE reid = ' + reid + ';';
	
	pool.query(update_query, (err, data) => {
		res.redirect('/owners_reservations')
	});
});

module.exports = router;