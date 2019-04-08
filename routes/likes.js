var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {

    var diner_username = 'Sijie';

    var likesQuery = 'SELECT fname, score'
    + ' FROM Likes'
    + ' WHERE username = $1'
    + ' ORDER BY score DESC;'

	pool.query(likesQuery, [diner_username], (err, data) => {
		res.render('likes', { title: 'Likes', data: data.rows });
	});
});

router.post('/', function(req, res, next) {

    var sql_query = 'INSERT INTO Likes VALUES';

    var diner_username = 'Sijie';
	
	var fname = req.body.fname;
	var score = req.body.score;
	
	var insert_query = sql_query + "('" + fname + "','" + diner_username + "','" + score + "')";
	
	pool.query(insert_query, (err, data) => {
		res.redirect('/likes')
	});
});

module.exports = router;