const fs = require("fs");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const cors = require("cors");
global.ROOTPATH = __dirname; 
var app = express();
var io = require("socket.io")();
let socketInterval;
app.io = io;

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use(cors());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(logger('common', { stream: accessLogStream })) 
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(__dirname + 'views'));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use('/cache', require('./cache'))
app.use("/api", indexRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require("./render")(app);

app.io.on("connection", async function (client) {
  console.log("New client connected");
  if (socketInterval) {
    clearInterval(socketInterval);
  }

  client.on("disconnect", function () {
    console.log("Client disconnected");
    clearInterval(socketInterval);
  });
}); 

// app.use(function (err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
