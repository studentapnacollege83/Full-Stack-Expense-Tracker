
const mongoose = require("mongoose");
const Transaction = require("../models/transaction");

// Helper: Give understandable validation error messages
const getFriendlyError = (error) => {
  if (error.name === "ValidationError") {
    return Object.values(error.errors)
      .map((item) => item.message)
      .join(" ");
  }

  if (error.name === "CastError") {
    if (error.path === "amount") {
      return "Please enter a valid numeric amount.";
    }

    if (error.path === "date") {
      return "Please enter a valid transaction date.";
    }

    return "Invalid transaction data. Please check your input.";
  }

  return null;
};

// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, transactionType, category, date } = req.body;

    const transaction = new Transaction({
      user: req.session.userId,
      title,
      amount,
      transactionType,
      category,
      date
    });

    await transaction.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error adding transaction:", error.message);

    const message = getFriendlyError(error);

    if (message) {
      return res.status(400).send(message);
    }

    return res.status(500).send(
      "Unable to add transaction due to a server error. Please try again."
    );
  }
};

// Show Edit Form
exports.getEditTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("Invalid transaction ID.");
    }

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.session.userId
    });

    if (!transaction) {
      return res.status(404).send("Transaction not found.");
    }

    res.render("edit-transaction", { transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error.message);

    return res.status(500).send(
      "Unable to open the edit page. Please try again."
    );
  }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("Invalid transaction ID.");
    }

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.session.userId
    });

    if (!transaction) {
      return res.status(404).send("Transaction not found.");
    }

    const { title, amount, transactionType, category, date } = req.body;

    transaction.title = title;
    transaction.amount = amount;
    transaction.transactionType = transactionType;
    transaction.category = category;
    transaction.date = date;

    await transaction.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error updating transaction:", error.message);

    const message = getFriendlyError(error);

    if (message) {
      return res.status(400).send(message);
    }

    return res.status(500).send(
      "Unable to update transaction due to a server error. Please try again."
    );
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("Invalid transaction ID.");
    }

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.session.userId
    });

    if (!deletedTransaction) {
      return res.status(404).send("Transaction not found.");
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error deleting transaction:", error.message);

    return res.status(500).send(
      "Unable to delete transaction due to a server error. Please try again."
    );
  }
};
