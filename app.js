/* cd "C:\Users\ADMIN\Desktop\Advance Expense Tracker" */
//npx @tailwindcss/cli -i ./input.css -o ./public/output.css

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const authRouter = require("./routes/authRouter");
const homeRouter = require("./routes/homeRouter");
const transactionRouter = require("./routes/transactionRouter");
const app = express();
const PORT = 3000;

// MongoDB Connection
const DB_PATH =
"mongodb+srv://Ankitsharma:sharmaji7878@ankitsharma.vbjoyvy.mongodb.net/expenseTracker?appName=AnkitSharma";
// MongoDB Session Store
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions"
});

store.on("error", (error) => {
  console.error("Session store error:", error.message);
});
// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// Session Middleware
app.use(
  session({
    secret: "sharmaji0083",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);


const User = require("./models/user");

app.use(async (req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session.userId);
  res.locals.currentUser = null;

  if (req.session.userId) {
    try {
      res.locals.currentUser = await User.findById(
        req.session.userId
      ).select("name");
    } catch (error) {
      console.error("Error fetching logged-in user:", error.message);
    }
  }

  next();
});
;

app.use("/", authRouter);
//
app.use("/", homeRouter);
app.use("/", transactionRouter);



// Connect to MongoDB and Start Server
mongoose
.connect(DB_PATH)
.then(() => {
console.log("Connected to MongoDB");


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


})
.catch((err) => {
console.error("MongoDB connection error:", err.message);
});
