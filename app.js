const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const logger = require('morgan');
const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require("./api/routes/index");
// const usersRouter = require("./api/routes/users");
const expressWinston = require("express-winston");
const { transports, format } = require("winston");
const routes = require("./api/routes/index");
const app = express();

app.use(
  expressWinston.logger({
    transports: [
      new transports.Console(),
      new transports.File({
        level: "warn",
        filename: "loggsWarning.log",
      }),
      new transports.File({
        level: "errors",
        filename: "loggsErrors.log",
      }),
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.prettyPrint()
    ),
    statusLevels: true,
  })
);
// view engine setup
app.set("views", path.join(__dirname, "api", "views"));
app.set("view engine", "ejs");

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/public", express.static(path.join(__dirname, "api", "public")));

app.use("/api", routes);
app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      " X-Requested-With",
      " Content-Type",
      " Accept ",
      " Authorization",
    ],
    credentials: true,
  })
);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
