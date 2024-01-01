const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    if (!email || !password) {
      return res
        .status(401)
        .json({ error: "Please fill in all required fields." });
    }

    const user = await User.findOne({ $or: [{ email }, { password }] });

    if (user) {
      return res.status(401).json({ error: "Email is already taken." });
    }

    if (password.length < 8) {
      return res
        .status(401)
        .json({ error: "password should be greater than 8 digits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const newUser = new User({ email, password: hashedPassword });

    const doc = await newUser.save();

    console.log(doc);

    const token = jwt.sign({ id: doc._id }, process.env.SECRET_KEY, {
      expiresIn: "10 days",
    });
    console.log(token);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(201).json({ email: email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    const isChecked = await bcrypt.compare(password, user.password);
    if (!isChecked) {
      return res.status(401).json({ error: "Invalid User" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10 days",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({ email: email });
  } catch (error) {
    console.log("error " + error.message);
    res.status(500).json({ error: error.message });
  }
};
