var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

router.get('/', function(req, res, next) {
    var diner_username = 'Sijie';

    var spendingsQuery = 'SELECT COALESCE(SUM(amount), 0) as spendings'
    + ' FROM Reserves'
    + ' WHERE username = $1';

    var avgSpendingsQuery = 'SELECT COALESCE(CAST(AVG(amount) AS NUMERIC(5,2)), 0) as spendings'
    + ' FROM Reserves'
    + ' WHERE username = $1';

    var reservationsQuery = 'SELECT COUNT(*) as reservations'
    + ' FROM Reserves'
    + ' WHERE username = $1';
    
    var outletsQuery = 'SELECT RE.rname as rname, RE.aname as aname, SUM(RE.amount) as total_amount,'
    + ' CAST(AVG(RE.amount) AS NUMERIC(5,2)) as avg_amount, COUNT(*) as reservations,'
    + ' COALESCE(AVG(RA.score), 0) as avg_score'
    + ' FROM Reserves RE natural left join Rates RA'
    + ' WHERE username = $1'
    + ' GROUP BY RE.rname, RE.aname';
    
    pool.query(spendingsQuery, [diner_username], (err, data) => {
        spendings = data.rows;
        pool.query(avgSpendingsQuery, [diner_username], (err, data) => {
            avgSpendings = data.rows;
            pool.query(reservationsQuery, [diner_username], (err, data) => {
                reservations = data.rows;
                pool.query(outletsQuery, [diner_username] , (err, data) => {
                    res.render('dashboard', {title: 'Overview', spendings: spendings, avgSpendings: avgSpendings, reservations: reservations, data: data.rows});
                })
            })
        })
    })
})



module.exports = router;