var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

var diner_username;

router.get('/', function(req, res, next) {

    diner_username = req.session.auth.username;

    var diners_reservation = 'SELECT reid,rname,aname,address,confirmed,numPax,dateTime as dt '
    + ' FROM reserves'
    + ' WHERE username = $1'
    + ' ORDER BY reid ASC;'

    pool.query(diners_reservation, [diner_username], (err, data) => {
        res.render('diners_reservations', {title: 'Reservations', data: data.rows});
    })
})

router.post('/', function(req, res, next) {

    var sql_query1 = 'UPDATE RESERVES '
    + 'SET CONFIRMED = ';
    var sql_query3 = ' WHERE username = $1 AND';
    var sql_query4 = ' REID = $2;';

    var reid = req.body.reid;
	var confirmed = req.body.confirmed;
	
	var update_query = sql_query1 + confirmed + sql_query3 + sql_query4;
	pool.query(update_query, [diner_username, reid], (err, data) => {
		res.redirect('/diners_reservations')
	});
});

module.exports = router;