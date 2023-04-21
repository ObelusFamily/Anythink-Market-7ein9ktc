require("dotenv").config();
import http from "http";
import path from "path";
import methods from "methods";
import express from "express";
import { urlencoded, json } from "body-parser";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import errorhandler from "errorhandler";
import { connect, set } from "mongoose";

var isProduction = process.env.NODE_ENV === "production";

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(require("method-override")());
app.use((__dirname + "/public"));

app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

if (!process.env.MONGODB_URI) {
  console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}

connect(process.env.MONGODB_URI);
if (isProduction) {
} else {
  set("debug", true);
}

import "./models/User";
import "./models/Item";
import "./models/Comment";
import "./config/passport";

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.end();
  } else {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
});

/// error handler
app.use(function(err, req, res, next) {
  console.log(err.stack);
  if (isProduction) {
    res.sendStatus(err.status || 500)
  } else {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  }
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port " + server.address().port);
});
