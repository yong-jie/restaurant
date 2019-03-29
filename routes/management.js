var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {
  var owner_username = 'JohnDoe';
  
  var reservationsQuery = 'SELECT R.startTime as startTime, R.endTime as endTime, R.numPax as numPax, R.amount as amount,'
  + ' R.confirmed as confirmed'
  + ' FROM Owns O inner join Reservations R on O.rname = R.rname'
  + ' WHERE O.username = $1';

  var earningsQuery = 'SELECT COALESCE(SUM(R.amount), 0) as amount'
  + ' FROM Owns O inner join Reservations R on O.rname = R.rname'
  + ' WHERE O.username = $1';

  var avgscoreQuery = 'SELECT COALESCE(AVG(R.score), 0) as score'
  + ' FROM Owns O inner join Rates R on O.rname = R.rname'
  + ' WHERE O.username = $1';

  pool.query(earningsQuery, [owner_username], (err, data) => {
    earnings = data.rows;
    pool.query(avgscoreQuery, [owner_username], (err, data) => {
      avgscore = data.rows;
      pool.query(reservationsQuery, [owner_username], (err, data) => {
        res.render('management', { title: 'Overview', earnings: earnings, avgscore: avgscore, data: data.rows });
      });
    })
  })
});

module.exports = router;