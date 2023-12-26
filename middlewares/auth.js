const jwt = require("jsonwebtoken");

function validatejwt(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Invalid jwt" });
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

function globalCatch(error, req, res, next) {
  res.json({ error });
}

module.exports = { validatejwt, globalCatch };
