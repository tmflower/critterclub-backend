"use strict";

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./utils/middleware");
const utilRoutes = require("./routes/util");
const userRoutes = require("./routes/users");
const parentRoutes = require("./routes/parents");
const animalRoutes = require("./routes/animals");
const authRoutes = require("./routes/auth");
const morgan = require("morgan");


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/util", utilRoutes);
app.use("/users", userRoutes);
app.use("/parents", parentRoutes);
app.use("/animals", animalRoutes);
app.use("/auth", authRoutes);

// handle not found errors
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
// handle any errors not otherwise caught
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;