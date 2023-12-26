const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is missing."],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is missing."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is missing."],
    },
    password: {
      type: String,
      minLength: [8, "Password should be atleast 8 character long."],
      required: [true, "Password is missing."],
    },
  },
  {
    timestamps: true,
    methods: {
      validatePassword(userPassword) {
        return bcrypt.compareSync(userPassword, this.password);
      },
    },
  }
);

userSchema.pre("save", function (next) {
  const hashedPassword = bcrypt.hashSync(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.path("email").validate(async (value) => {
  const emailCount = await mongoose.models.User.countDocuments({
    email: value,
  });
  return !emailCount;
}, "Email already exists");

const User = mongoose.model("User", userSchema);

module.exports = User;
