var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var pg = require("pg");
var session = require("express-session");
var pgSession = require("connect-pg-simple")(session);
const config = require("./config.js");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var restaurantsRouter = require("./routes/restaurants");
var reservationsRouter = require("./routes/reservations");
var insertRouter = require("./routes/insert");
var ratesRouter = require("./routes/rates");
var ratingsRouter = require("./routes/ratings");
var promosRouter = require("./routes/promos");
var recommendRouter = require("./routes/recommend");
var managementRouter = require("./routes/management");
var menuRouter = require("./routes/menu");
var dashboardRouter = require("./routes/dashboard");
var likesRouter = require("./routes/likes");
var owners_menuRouter = require("./routes/owners_menu");

var pgPool = new pg.Pool(config.pgConfig);
var app = express();

app.use(
  session({
    store: new pgSession({
      pool: pgPool, // Connection pool
      tableName: "session", // Use another table-name than the default "session" one
    }),
    secret: "I love CS2102",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  }),
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/reservations", reservationsRouter);
app.use("/users", usersRouter);
app.use("/insert", insertRouter);
app.use("/promos", promosRouter);
app.use("/rates", ratesRouter);
app.use("/ratings", ratingsRouter);
app.use("/recommend", recommendRouter);
app.use("/management", managementRouter);
app.use("/menu", menuRouter);
app.use("/dashboard", dashboardRouter);
app.use("/likes", likesRouter);
app.use("/owners_menu", owners_menuRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
