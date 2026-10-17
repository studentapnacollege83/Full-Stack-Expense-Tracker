
const Transaction = require("../models/transaction");

exports.getHome = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.session.userId
    }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.transactionType === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.transactionType === "expense") {
        totalExpenses += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    res.render("index", {
      transactions,
      totalIncome,
      totalExpenses,
      balance
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).send("Unable to load transactions.");
  }
};
