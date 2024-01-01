const express = require("express");
const { User } = require("./models/user");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json());

app.use("/api/user", userRouter.router);

app.get("/api/user/getUser", async (req, res) => {
  const users = await User.find();

  res.status(200).json(users);
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

app.listen(8080, () => {
  console.log("server started on port 8080");
});
