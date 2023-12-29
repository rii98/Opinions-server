const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    followingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    methods: {
      validatePassword(userPassword) {
        return bcrypt.compareSync(userPassword, this.password);
      },
      generatejwt() {
        return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
          expiresIn: "15min",
        });
      },
      verifyjwt(token) {
        return jwt.verify(token, process.env.JWT_KEY);
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
