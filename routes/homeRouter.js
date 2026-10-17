
const express = require("express");
const homeRouter = express.Router();

const homeController = require("../controllers/homeController");

// Protect dashboard: login required
homeRouter.get("/", (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/signup");
  }

  next();
}, homeController.getHome);

module.exports = homeRouter;


