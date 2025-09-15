const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Přístup povolen pouze administratorům" });
  }
  next();
};

module.exports = admin;
