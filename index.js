var express = require("express");
var app = express();

/* ADMIN DEDICATED ROUTES. */
const product = require("../controllers/admin/Product");

app.use("/product", product);


/* USER DEDICATED ROUTES. */
const user_product = require("../controllers/Product");
app.use("/user-product", user_product);

module.exports = app;
