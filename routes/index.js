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
  res.render("index", { title: "Express" });
});

router.get("/signup", (req, res, next) => {
  return res.render("signup");
})

router.post("/signup", async (req, res, next) => {
  if (!(req.body && req.body.username && req.body.password && req.body.type)) {
    return res.send("Missing fields");
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
    const type = req.body.type === "Diner" ? "diners" : req.body.type === "Admin" ? "admins" : "owners";
    await new Promise((resolve, reject) => {
      pool.query(`INSERT INTO ${type} VALUES ('${req.body.username}')`, (err, data) => {
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
