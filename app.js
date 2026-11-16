/* cd "C:\Users\ADMIN\Desktop\Advance Expense Tracker" */
//npx @tailwindcss/cli -i ./input.css -o ./public/output.css

require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const authRouter = require("./routes/authRouter");
const homeRouter = require("./routes/homeRouter");
const transactionRouter = require("./routes/transactionRouter");

const User = require("./models/user");

const app = express();

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Environment variables check
if (!DB_PATH || !SESSION_SECRET) {
  throw new Error("MONGODB_URI and SESSION_SECRET must be set.");
}

// Railway / production proxy
app.set("trust proxy", 1);

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Session Store
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions"
});

store.on("error", (error) => {
  console.error("Session store error:", error.message);
});

// Session Middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Logged-in user middleware
app.use(async (req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session.userId);
  res.locals.currentUser = null;

  if (req.session.userId) {
    try {
      res.locals.currentUser = await User.findById(
        req.session.userId
      ).select("name");
    } catch (error) {
      console.error(
        "Error fetching logged-in user:",
        error.message
      );
    }
  }

  next();
});

// Routes
app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/", transactionRouter);

// Connect to MongoDB and start server
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
