const Post = require("../models/postmodel");
const { z } = require("zod");

const handleGetSomePost = async (req, res) => {
  const { page } = req.query;
  console.log(page);

  const count = 2;
  const skip = (Number(page) - 1) * count;
  try {
    const posts = await Post.find().skip(skip).limit(count);
    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.log("Error while fetching some post: ", error);
    res.status(500).json(error);
  }
};

const handleCreate = async (req, res) => {
  const { text } = req.body;
  const postSchema = z.object({
    text: z.string().min(1, "Opinions field cannot be empty."),
  });

  const validation = postSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });

  try {
    const test = await Post.create({
      text,
    });
    res.status(201).json(test);
  } catch (error) {
    console.log("Error in creating new post: ", error);
    res.status(500).json(error);
  }
};

module.exports = { handleCreate, handleGetSomePost };
