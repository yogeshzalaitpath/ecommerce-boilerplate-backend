const http = require("http");
const express = require("express");
const path = require("path");

// const createError = require("http-errors");

const cors = require("cors");
const logger = require("morgan");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

const db = require("./api/models/index.js");

const errorHandler = require("./api/middlewares/errorHandler.middleware");

const successResponseHelper = require("./api/helpers/successResponse.helper");

const routes = require("./api/routes/index");

const server = http.createServer(app);

app.set("views", path.join(__dirname, "api", "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use("/api/public", express.static(path.join(__dirname, "api", "public")));

app.use(
  "/api",
  (req, res, next) => {
    successResponse = successResponseHelper.successResponse;
    next();
  },
  routes
);

// app.use(function (req, res, next) {
//   next(createError(404));
// });

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
app.use(errorHandler);

// Check Database Connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Sync Sequelize models with the database
db.sequelize.sync({ alter: true, force: false }).then(() => {
  console.log("🔁 Database Synchronized.");
});

const port = normalizePort(process.env.PORT || "4001");
app.set("port", port);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `${addr.port}`;
  console.log(`🚀 SERVER is running at http://localhost:${bind}`);
}
