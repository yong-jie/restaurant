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

  var outletsQuery = 'SELECT RA.rname as rname, RA.aname as aname, RA.address as address,'   
  + ' (SELECT CAST(COALESCE(SUM(amount), 0.0) AS NUMERIC(5, 2)) FROM Reserves where RA.aname = aname and RA.address = address) as earnings,'
  + ' (SELECT COALESCE(AVG(SCORE), 0.0) FROM Rates where RA.aname = aname and RA.rname = rname and RA.address = address) as avgscore,'
  + ' (SELECT COUNT(*) FROM Reserves where RA.aname = aname and RA.address = address) as reservations'    
  + ' FROM Owners O right join RestaurantAreas RA on O.rname = RA.rname'
  + ' WHERE O.username = $1'  
  + ' GROUP BY RA.rname, RA.aname, RA.address';

  var mostImprovedQuery = 'with OldScore as ('
  + ' select RA.rname, RA.aname, RA.address, coalesce(avg(R.score), 5) as old'
  + ' from Rates R right join RestaurantAreas RA on R.rname = RA.rname and R.aname = RA.aname and R.address = RA.address'
  + ' where R.dateTime <= (CAST($1 as TIMESTAMP) - CAST(\'1 week\' as INTERVAL))'
  + ' group by (RA.rname, RA.aname, RA.address)'
  + ' ),'
  + ' NewScore as ('
  + '   select RA.rname, RA.aname, RA.address, coalesce(avg(R.score), 5) as new'
  + '   from Rates R right join RestaurantAreas RA on R.rname = RA.rname and R.aname = RA.aname and R.address = RA.address'
  + '   group by (RA.rname, RA.aname, RA.address)'
  + ' ),'
  + ' MaxImprove as ('
  + '   select max(new - coalesce(old, 5)) as maxDiff'
  + '   from OldScore O right join NewScore N on O.rname = N.rname and O.aname = N.aname and O.address = N.address'
  + '   where N.rname = (select OW.rname from Owners OW where username = $2)'
  + ' )'
  + ' select N.aname, N.address, coalesce(old, 5) as old, new, new - coalesce(old, 5) as diff'
  + ' from OldScore O right join NewScore N on O.rname = N.rname and O.aname = N.aname and O.address = N.address'
  + ' where N.rname = (select OW.rname from Owners OW where username = $2) and new - coalesce(old, 5) > 0 and new - coalesce(old, 5) = (select * from MaxImprove)'
  + ' order by diff asc;'

  var dateTime = 'SELECT LOCALTIMESTAMP as t;';
  var currentTime = '';

  pool.query(dateTime, (err, data) => {
    currentTime = data.rows[0].t.toISOString().replace('Z', '').replace('T', ' ');
  })

  pool.query(earningsQuery, [owner_username], (err, data) => {
    earnings = data.rows;
    pool.query(avgscoreQuery, [owner_username], (err, data) => {
      avgscore = data.rows;
      pool.query(reservationsQuery, [owner_username], (err, data) => {
        reservations = data.rows;
        pool.query(outletsQuery, [owner_username], (err, data) => {
          dat = data.rows;
          pool.query(mostImprovedQuery, [currentTime, owner_username], (err, data) => {
            res.render('management', { title: 'Overview', earnings: earnings, avgscore: avgscore, reservations: reservations, data: dat, mostImproved: data.rows });
          })
        })
      })
    })
  })
})

router.get('/add', function(req, res, next) {
  aname = req.query.aname;
  address = req.query.address;
  open = req.query.open;
  close = req.query.close;

  var rname = '';
  var insertStatement = 'INSERT INTO RestaurantAreas (rname, aname, address, startTime, endTime) VALUES ($1, $2, $3, $4, $5);'

  pool.query('SELECT rname FROM Owners WHERE username = $1', [req.session.auth.username], (err, data) => {
    rname = data.rows[0].rname;

    pool.query(insertStatement, [rname, aname, address, open, close], (err, data) => {
      res.redirect('/management');
    })
  })
})

router.get('/promote', function(req, res, next) {
  discount = parseInt(req.query.discount);
  endDate = req.query.enddate;

  if (discount <= 0 || discount >= 100) {
    res.redirect('/management');
  } else {
    var rname = '';
    var insertStatement = 'INSERT INTO RestaurantPromos (rname, discount, startDate, endDate) VALUES ($1, $2, $3, $4);'

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    var startDate = yyyy + '-' + mm + '-' + dd;
    console.log(startDate);

    pool.query('SELECT rname FROM Owners WHERE username = $1', [req.session.auth.username], (err, data) => {
      rname = data.rows[0].rname;

      pool.query(insertStatement, [rname, discount, startDate, endDate], (err, data) => {
        res.redirect('/management');
      })
    })
  }
})

module.exports = router;