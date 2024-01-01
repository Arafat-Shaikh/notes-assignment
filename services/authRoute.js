const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

exports.authRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded token", decodedToken);

    const user = await User.findById(decodedToken.id).select("-password");

    req.user = user;

    next();
  } catch (error) {
    console.log("error in authentication " + error.message);
    res.status(500).json({ error: error.message });
  }
};
