const jwt = require("jsonwebtoken");

exports.authRoute = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decodedToken);
    res.status(200).json({ success: "ok" });
  } catch (error) {
    console.log("error in authentication " + error.message);
    res.status(500).json({ error: error.message });
  }
};
