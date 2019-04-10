var express = require('express');
var router = express.Router();

const { Pool } = require("pg");
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

var owner_rname;
var owner_cname;

router.get('/', function(req, res, next) {

    var owner_username = req.session.auth.username;

    var rnameQuery = 'SELECT rname FROM Owners WHERE username = $1';
    var cnameQuery = 'SELECT cname FROM Restaurants WHERE rname = $1';

    var sellsQuery = 'SELECT fname, price'
    + ' FROM Sells'
    + ' WHERE rname = $1';

    pool.query(rnameQuery, [owner_username], (err, data) => {
        owner_rname = data.rows[0].rname;
        pool.query(cnameQuery, [owner_rname], (err, data) => {
            owner_cname = data.rows[0].cname;
            pool.query(sellsQuery, [owner_rname], (err, data) => {
                res.render('owners_menu', { title: 'Menu', data: data.rows });
            });
        })
    })
});

router.post('/', function(req, res, next) {

    var food_query = 'INSERT INTO Food VALUES';
    var sells_query = 'INSERT INTO Sells VALUES';
	
	var fname = req.body.fname;
	var price = req.body.price;
	
    var insertFood_query = food_query + "('" + fname + "','" + owner_cname + "')";
    var insertSells_query = sells_query + "('" + owner_rname + "','" + fname + "','" + price + "')";
	
    var inFood_query = 'SELECT COUNT (*)'
    + ' FROM Food'
    + ' WHERE fname = $1 and cname = $2;'

    pool.query(inFood_query, [fname, owner_cname], (err, data) => {
        
        // Food is in Food List with same cuisine
        if (data.rows[0].count > 0) {
            pool.query(insertSells_query, (err, data) => {
                res.redirect('/owners_menu');
            })
        }

        // Food is not in Food List with same cuisine
        else {

            const tx = async callback => {
                const client = await pool.connect()
                try {
                await client.query('BEGIN')
                    try {
                        await callback(client)
                        client.query('COMMIT')
                    } catch(e) {
                        client.query('ROLLBACK')
                    }
                } finally {
                    client.release()
                    res.redirect('/owners_menu')
                }
            }

            tx(async client => {
                await client.query(insertFood_query);
                await client.query(insertSells_query);
            })

        }
    })  
});

module.exports = router;