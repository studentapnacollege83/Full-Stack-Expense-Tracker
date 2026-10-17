
const mongoose = require("mongoose");

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Salary",
  "Pocket Money",
  "Other"
];

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: [true, "Transaction title is required."],
    trim: true,
    minlength: [2, "Title must contain at least 2 characters."]
  },

  amount: {
    type: Number,
    required: [true, "Transaction amount is required."],
    min: [0.01, "Amount must be greater than zero."],
    max: [10000000, "Amount cannot exceed ₹1 crore."],
    validate: {
      validator: Number.isFinite,
      message: "Please enter a valid amount."
    }
  },

  transactionType: {
    type: String,
    required: [true, "Please select a transaction type."],
    enum: {
      values: ["income", "expense"],
      message: "Transaction type must be income or expense."
    }
  },

  category: {
    type: String,
    required: [true, "Please select a category."],
    trim: true,
    enum: {
      values: categories,
      message: "Please select a valid category."
    }
  },

  date: {
    type: Date,
    required: [true, "Transaction date is required."]
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
