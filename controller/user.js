const User = require("../models/usermodel");

const getSelf = async (req, res) => {
  const user = await User.findById({ _id: req.user.id }).select("-password");
  res.json(user);
};
module.exports = { getSelf };
