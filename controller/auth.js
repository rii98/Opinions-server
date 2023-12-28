const User = require("../models/usermodel");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  const { email, password } = req.body;
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be 8 character long zod error."),
  });

  const validation = loginSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });
  try {
    const user = await User.findOne({ email });
    if (user.validatePassword(password)) {
      const token = user.generatejwt();
      const { email, firstname, lastname, _id } = user;
      res.json({ email, firstname, lastname, token, id: _id });
    } else {
      res.status(401).json({ message: "Incorrect email or password." });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

const signup = async (req, res) => {
  const { email, password, confirmPassword, firstname, lastname } = req.body;
  console.log(req.body);
  const signupSchema = z
    .object({
      email: z.string().email(),
      password: z
        .string()
        .min(8, "Password must be 8 character long zod error."),
      confirmPassword: z.string(),
      firstname: z.string(),
      lastname: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and confirm password don't match zod error",
      path: ["confirmPassword"],
    });

  const validation = signupSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });

  try {
    const user = await User.create({ email, password, firstname, lastname });
    const token = user.generatejwt();
    res.json({ email, firstname, lastname, token, id: user._id });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const authValidate = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ verified: false });
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return res.json({ verified: true });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ verified: false });
  }
};
module.exports = { login, signup, authValidate };
