const User = require("../models/usermodel");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.validatePassword(password)) {
      const token = user.generatejwt();
      const { email, firstname, lastname } = user;
      res.json({ email, firstname, lastname, token });
    } else {
      res.status(401).json({ message: "Incorrect email or password." });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

const signup = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  try {
    const user = await User.create({ email, password, firstname, lastname });
    const token = user.generatejwt();
    const { email, firstname, lastname } = user;
    res.json({ email, firstname, lastname, token });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { login, signup };
