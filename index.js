const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("./models/user");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());

app.post("/api/user/signup", async (req, res) => {
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

    if (user.email) {
      return res.status(401).json({ error: "This email is already taken." });
    }

    if (password.length < 8) {
      return res
        .status(401)
        .json({ error: "password should be greater than 8 digits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email: email, password: hashedPassword });

    const doc = await newUser.save();

    console.log(doc);
    res.status(201).json({ success: "user created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/user/getUser", async (req, res) => {
  res.status(200).json({ message: "hello world" });
});

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

app.listen(8080, () => {
  console.log("server started on port 8080");
});
