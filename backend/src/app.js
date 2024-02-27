const compression = require("compression");
const createError = require("http-errors");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const isProduction = process.env.NODE_ENV === "production";

//midelware
app.use(
  isProduction ? morgan("combined", { stream: accessLogStream }) : morgan("dev")
);
app.use(helmet());
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//database

//routes
const initRoutes = require('./routers')
initRoutes(app)

//error handler
app.use((req, res, next) => {
    {
      const error = new Error('Not Found')
      error.code = 404
      next(error)
    }
  })
  app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      message: error.message || "Internal Server Error",
    });
  });
  
  module.exports = app