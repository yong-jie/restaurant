var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const config = require("../config.js");
const pool = new Pool(config.pgConfig);

function constructQuery(foodname, location, budget) {
	foodname = "\'\%" + foodname + "\%\'";
	location = "\'\%" + location + "\%\'";

	budget = parseFloat(budget);
	if (isNaN(budget)) {
		budget = 10000.0;
	}

	var query = "";

	query += "with RatingScores as ( "
	+ "select RA.rname, RA.aname, coalesce((select avg(score) / 10 from Rates R1 where RA.rname = R1.rname and RA.aname = R1.aname), 5) as rscore "
	+ "from RestaurantAreas RA left join Rates R2 "
	+ "on RA.rname = R2.rname and RA.aname = R2.aname), ";

	query += "AreaScores as ( "
	+ "select RA.rname, RA.aname, case "
	+ "	   when RA.aname ilike " + location + " then 1 "
	+ "	   else 0 "
	+ "end as ascore "
	+ "from RestaurantAreas RA), ";

	query += "CuisineScores as ( "
	+ "select RA.rname, RA.aname, case "
	+ "    when R.cname ilike " + foodname + " then 1 "
	+ "    else 0 "
	+ "end as cscore "
	+ "from RestaurantAreas RA natural join Restaurants R), ";

	query += "FoodScores as ( "
	+ "select RA.rname, RA.aname, case "
	+ "	   when exists(select 1 from RestaurantAreas RA natural join Restaurants R natural join Food F where F.fname ilike " + foodname + ") then 1 "
	+ "    else 0 "
	+ "end as fscore "
	+ "from RestaurantAreas RA), ";

	query += "BudgetScores as ( "
	+ "select RA.rname, RA.aname, case "
	+ "    when (select avg(price) from Sells S where S.rname = RA.rname) > " + budget + " then (" + budget + " - (select avg(price) from Sells S where S.rname = RA.rname)) * 0.1 "
	+ "	   else 0 "
	+ "end as bscore "
	+ "from RestaurantAreas RA), ";

	query += "SeedScores as ( "
	+ "select rname, aname, (  (select random() * 0.2 + 0.8) * rscore "
	+ "                      + (select random() * 0.2 + 0.8) * ascore "
	+ "                      + (select random() * 0.2 + 0.8) * cscore "
	+ "                      + (select random() * 0.2 + 0.8) * fscore "
	+ "                      + (select random() * 0.2 + 0.8) * bscore ) as seedscore "
	+ "from RatingScores natural join AreaScores natural join CuisineScores natural join FoodScores natural join BudgetScores "
	+ "order by seedscore desc "
	+ "limit 1) ";

	query += "select SS.rname as rname, SS.aname as aname, R.cname as cname, RA.address as address, "
	+ "    coalesce((select avg(score) from Rates where rname = SS.rname and aname = SS.aname), 5) as score, "
	+ "    coalesce((select cast(avg(S1.price) AS numeric(5,2)) from Sells S1 natural join Food F1 where S1.rname = SS.rname), 0) as price, "
	+ "    RA.startTime as start, RA.endTime as end "   
	+ "from SeedScores SS natural join RestaurantAreas RA natural join Restaurants R;";

	return query;
}

function constructBlankQuery() {
	return "select rname, aname from RestaurantAreas where 1 = 0;"
}

// GET
router.get('/', function(req, res, next) {
	var query = constructBlankQuery();

	pool.query(query, (err, data) => {
	 	res.render('recommend', {title : 'Recommendation', data : data.rows});
	});
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var foodname = req.body.foodname;
	var location = req.body.location;
	var budget = req.body.budget;

	var query = constructQuery(foodname, location, budget);
	
	pool.query(query, (err, data) => {
	 	res.render('recommend', {title : 'Recommendation', data : data.rows});
	});
});

module.exports = router;
