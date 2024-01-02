const express = require("express");
const { User } = require("./models/user");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const notesRouter = require("./routes/notesRoute");
const app = express();
const jwt = require("jsonwebtoken");
const { authRoute } = require("./services/authRoute");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter.router);
app.use("/api/notes", notesRouter.router);

app.get("/api/user/getUser", async (req, res) => {
  const users = await User.find();

  res.status(200).json(users);
});

app.get("/checkUser", authRoute, (req, res) => {
  res.status(200).json("checking route");
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = app;
