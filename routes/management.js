var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {
  
  var owner_username = req.session.auth.username;

  var reservationsQuery = 'SELECT COALESCE(COUNT(R.rname), 0) as reservations'
  + ' FROM Owners O inner join Reserves R on O.rname = R.rname'
  + ' WHERE O.username = $1';

  var earningsQuery = 'SELECT COALESCE(SUM(R.amount), 0) as earnings'
  + ' FROM Owners O inner join Reserves R on O.rname = R.rname'
  + ' WHERE O.username = $1';

  var avgscoreQuery = 'SELECT COALESCE(AVG(R.score), 0) as avgscore'
  + ' FROM Owners O inner join Rates R on O.rname = R.rname'
  + ' WHERE O.username = $1';

  var outletsQuery = 'SELECT R.rname as rname, R.aname as aname, R.address as address,'   
  + ' COALESCE(SUM(R.amount), 0) as earnings,'
  + ' (SELECT COALESCE(AVG(SCORE), 0) FROM Rates where R.aname = aname and R.rname = rname and R.address = address) as avgscore,'
  + ' COUNT(*) as reservations'    
  + ' FROM Owners O inner join Reserves R on O.rname = R.rname'
  + ' WHERE O.username = $1'  
  + ' GROUP BY R.rname, R.aname, R.address';

  pool.query(earningsQuery, [owner_username], (err, data) => {
    earnings = data.rows;
    pool.query(avgscoreQuery, [owner_username], (err, data) => {
      avgscore = data.rows;
      pool.query(reservationsQuery, [owner_username], (err, data) => {
        reservations = data.rows;
        pool.query(outletsQuery, [owner_username], (err, data) => {
          res.render('management', { title: 'Overview', earnings: earnings, avgscore: avgscore, reservations: reservations, data: data.rows });
        })
      })
    })
  })
})

module.exports = router;