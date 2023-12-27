const Post = require("../models/postmodel");
const mongoose = require("mongoose");
const { z } = require("zod");
const handleGetSomePost = async (req, res) => {
  const { page } = req.query;
  const count = 10;
  const skip = (Number(page) - 1) * count;
  try {
    const posts = await Post.find()
      .skip(skip)
      .limit(count)
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -createdAt -updatedAt -__v",
      });

    res.json(posts);
  } catch (error) {
    console.log("Error while fetching some post: ", error);
    res.status(500).json(error);
  }
};

const handleCreate = async (req, res) => {
  console.log(req.body);
  const { text, user } = req.body;
  const postSchema = z.object({
    text: z.string().min(1, "Opinions field cannot be empty."),
    user: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid user id zod error",
    }),
  });

  const validation = postSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });

  try {
    const test = await Post.create({
      text,
      user,
    });
    res.status(201).json(test);
  } catch (error) {
    console.log("Error in creating new post: ", error);
    res.status(500).json(error);
  }
};

module.exports = { handleCreate, handleGetSomePost };
