const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    console.log("Authorization header:", req.header("Authorization"));
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Extracted token:", token);

    if (!token) {
      return res.status(401).json({ error: "Přístup zamítnut, token chybí" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Token je neplatné" });
    }

    req.user = user;
    console.log('User role:', req.user.role);
    next();
  } catch (error) {
    res.status(401).json({ error: "Token je neplatný" });
  }
};

module.exports = auth;
