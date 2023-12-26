const User = require("../models/usermodel");
const { z } = require("zod");
const login = async (req, res) => {
  const { email, password } = req.body;
  const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be 8 character long zod error."),
  });

  const validation = loginSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });
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
  const { email, password, confirmPassword, firstname, lastname } = req.body;
  const signupSchema = z
    .object({
      email: z.string().email("Invalid email zod error"),
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
  // if (password !== confirmPassword) {
  //   return res
  //     .status(400)
  //     .json({ message: "Password and Confirm password don't match." });
  // }
  try {
    const user = await User.create({ email, password, firstname, lastname });
    const token = user.generatejwt();
    res.json({ email, firstname, lastname, token });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = { login, signup };
