

const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Show Signup Page
exports.getSignup = (req, res) => {
  if (req.session.userId) {
    return res.redirect("/");
  }

  res.render("signup");
};

// Create Account
exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Please fill all fields.");
    }

    if (password.length < 8) {
      return res.status(400).send("Password must be at least 8 characters.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).send("Email already registered. Please login.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    req.session.userId = user._id.toString();
    res.redirect("/");
  } catch (error) {
    console.error("Signup Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).send("Email already registered. Please login.");
    }

    res.status(500).send("Signup failed. Please try again.");
  }
};

// Show Login Page
exports.getLogin = (req, res) => {
  if (req.session.userId) {
    return res.redirect("/");
  }

  res.render("login");
};

// Login User
exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).send("Please enter email and password.");
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid email or password.");
    }

    req.session.userId = user._id.toString();
    res.redirect("/");
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).send("Login failed. Please try again.");
  }
};

// Logout User
exports.postLogout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout Error:", error.message);
      return res.status(500).send("Unable to logout.");
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
