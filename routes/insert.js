var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

/* SQL Query */
var sql_query = 'INSERT INTO reserves VALUES';

// GET
router.get('/', function(req, res, next) {
    res.render('insert', { title: 'Restaurant' });
});

// POST
router.post('/', function(req, res, next) {
    // Retrieve Information
    
    var reid = 'SELECT COUNT(*) as c'
    + ' FROM Reserves';

    var rname    = req.body.rname;
    var aname    = req.body.aname;
    var address = req.body.address;
    var username  = req.session.auth.username;
    var numPax = req.body.numPax;
    var confirmed = req.body.confirmed;
    var dateTime = req.body.dateTime;
    
    pool.query(reid, (err,data) => {
        numRes = data.rows[0].c;
        // Construct Specific SQL Query
        var insert_query = sql_query + "('" + numRes + "','" + rname + "','" + aname + "','" + address + "','" + username + "','" + numPax + "','" + confirmed + "','"
        + '0.00' + "','" + dateTime  + "')";
        pool.query(insert_query, (err, data) => {
            res.redirect('/reservations')
        });
    })

});

module.exports = router;
