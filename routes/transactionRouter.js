
const express = require("express");
const transactionRouter = express.Router();

const transactionController = require("../controllers/transactionController");

// Check whether the user is logged in
const checkLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  next();
};

// Add Transaction
transactionRouter.post(
  "/transactions/add",
  checkLogin,
  transactionController.addTransaction
);

// Show Edit Form
transactionRouter.get(
  "/transactions/edit/:id",
  checkLogin,
  transactionController.getEditTransaction
);

// Update Transaction
transactionRouter.post(
  "/transactions/update/:id",
  checkLogin,
  transactionController.updateTransaction
);

// Delete Transaction
transactionRouter.post(
  "/transactions/delete/:id",
  checkLogin,
  transactionController.deleteTransaction
);

module.exports = transactionRouter;
