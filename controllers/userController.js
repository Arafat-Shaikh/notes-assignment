const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Sign up a new user.

exports.signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res
        .status(401)
        .json({ error: "Please fill in all required fields." });
    }

    // Check if the email or password is already taken
    const user = await User.findOne({ $or: [{ email }, { password }] });

    if (user) {
      return res.status(401).json({ error: "Email is already taken." });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(401)
        .json({ error: "password should be greater than 8 digits" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with hashed password
    const newUser = new User({ email, password: hashedPassword });

    // Save the new user to the database
    const doc = await newUser.save();

    // Generate a JWT token for the user
    const token = jwt.sign({ id: doc._id }, process.env.SECRET_KEY, {
      expiresIn: "10 days",
    });

    // Set the JWT token as an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // Respond with the user's email
    res.status(201).json({ email: email });
  } catch (error) {
    // Handle any errors during the signup process
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Login an existing user.

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(401).json({ error: "Email and password required" });
    }

    // Find the user by email
    const user = await User.findOne({ email: email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // Check if the password is valid
    const isChecked = await bcrypt.compare(password, user.password);
    if (!isChecked) {
      return res.status(401).json({ error: "Invalid User" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10 days",
    });

    // Set the JWT token as an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // Respond with the user's email
    res.status(200).json({ email: email });
  } catch (error) {
    // Handle any errors during the login process
    console.log("error " + error.message);
    res.status(500).json({ error: error.message });
  }
};
