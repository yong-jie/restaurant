var express = require("express");
const { Pool } = require("pg");
const config = require("../config.js");

var router = express.Router();
const pool = new Pool(config.pgConfig);

/* GET home page. */
router.get("/", function(req, res, next) {
  if (!req.session.auth) {
    // Give them the option to create account or log in.
    return res.render("notloggedin");
  }
  // User is authenticated.
  res.render("index", { username: req.session.auth.username, type: req.session.auth.type });
});

router.get("/signup", async (req, res, next) => {
  const cuisines = await pool.query(`SELECT * from cuisines`);
  return res.render("signup", { cuisines: cuisines.rows });
})

router.get("/login", (req, res, next) => {
  return res.render("login");
})

router.get("/logout", (req, res, next) => {
  req.session.auth = false;
  return res.redirect("/");
})

router.post("/login", async (req, res, next) => {
  if (!(req.body && req.body.username && req.body.password)) {
    return res.send("Missing fields");
  }
  
  // First check users.
  {
    let { rows } = await pool.query(`SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`);
    if (rows.length === 0) return res.send("Incorrect credentials");
  }

  req.session.auth = { username: req.body.username};

  // Now check what authorization this user is.
  {
    let { rows } = await pool.query(`SELECT * FROM diners WHERE username = '${req.body.username}'`);
    if (rows.length !== 0) req.session.auth.type = 'Diners';
  }
  {
    let { rows } = await pool.query(`SELECT * FROM owners WHERE username = '${req.body.username}'`);
    if (rows.length !== 0) req.session.auth.type = 'Owners';
  }

  if (!req.session.auth.type) return res.send("You do not have an authorization level. This should not be happening.");
  return res.redirect("/");
});

router.post("/signup", async (req, res, next) => {
  if (!(req.body && req.body.username && req.body.password && req.body.type)) {
    return res.send("Missing fields");
  }
  if (req.body.type === "Owner") {
    if (!(req.body.restaurant_name && req.body.cuisine)) {
      return res.send("Missing fields");
    }

    try {
      // Create restaurant
      await pool.query(`INSERT into restaurants values ('${req.body.restaurant_name}', '${req.body.cuisine}')`);
    } catch (err) {
      return res.send("Failed to create restaurant");
    }
  }

  // TODO: Check for collisions
  try {
    // First create a user row.
    await new Promise((resolve, reject) => {
      pool.query(`INSERT INTO users VALUES ('${req.body.username}', '${req.body.password}')`, (err, data) => {
        if (err) return reject(err);
        return resolve();
      });
    });

    // Then create specific ISA relationship row.
    const type = req.body.type === "Diner" ? "Diners" : "Owners";
    const owner_query = req.body.type=== "Owner" ? `, '${req.body.restaurant_name}'`:'';
    await new Promise((resolve, reject) => {
      pool.query(`INSERT INTO ${type} VALUES ('${req.body.username}'${owner_query})`, (err, data) => {
        if (err) return reject(err);
        return resolve();
      });
    });

    req.session.auth = { username: req.body.username, type };
  } catch(err) {
    return res.send(err);
  }
  return res.redirect("/");
})


module.exports = router;
