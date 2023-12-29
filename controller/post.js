const Post = require("../models/postmodel");
const mongoose = require("mongoose");
const { z } = require("zod");
const { Upvote } = require("../models/upvotesmodel");

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

    const userf = await Post.findById({ _id: test._id }).populate({
      path: "user",
      select: "-password -createdAt -updatedAt -__v",
    });

    res.status(201).json(userf);
  } catch (error) {
    console.log("Error in creating new post: ", error);
    res.status(500).json(error);
  }
};

const handleUpvotes = async (req, res) => {
  const { post, user, add } = req.body;

  const localUpvotesSchema = z.object({
    post: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid postid",
    }),
    user: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid userid",
    }),
    add: z.string(),
  });

  const validation = localUpvotesSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });

  try {
    if (add === "true") {
      if (await Upvote.findOne({ post, user }))
        return res.json({
          message: "Cannot like the post already liked.",
        });

      const newUpvote = await Upvote.create({ post, user });
      const selectedPost = await Post.findByIdAndUpdate(
        { _id: post },
        {
          $push: { upvotes: newUpvote },
          $inc: { upvotesCount: 1 },
        },
        {
          new: true,
        }
      );
      res.json({ newUpvote });
    } else {
      const removedUpvote = await Upvote.findOneAndDelete({ post, user });
      if (!removedUpvote)
        return res.status(404).json({ message: "Cannot find the upvote." });
      const { _id } = removedUpvote;
      const selectedPost = await Post.findByIdAndUpdate(
        { _id: post },
        {
          $pull: { upvotes: { _id } },
          $inc: { upvotesCount: -1 },
        },
        {
          new: true,
        }
      );
      return res.json({ selectedPost });
    }
  } catch (error) {
    console.log("Error adding new upvote:", error);
    res.status(400).json(error);
  }
};

const checkIfAlreadyLiked = async (req, res) => {
  const { post, user } = req.body;
  console.log(req.body);
  const localUpvotesSchema = z.object({
    post: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid postid",
    }),
    user: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid userid",
    }),
  });

  const validation = localUpvotesSchema.safeParse(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });

  try {
    if (await Upvote.findOne({ post, user }))
      return res.json({
        alreadyLiked: true,
      });

    return res.json({
      alreadyLiked: false,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const getPopular = async (req, res, next) => {
  try {
    const popular = await Post.find()
      .sort({ upvotesCount: -1, createdAt: -1 })
      .limit(10)
      .populate({
        path: "user",
        select: "-password -createdAt -updatedAt -__v",
      });
    res.json(popular);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handleCreate,
  handleGetSomePost,
  handleUpvotes,
  checkIfAlreadyLiked,
  getPopular,
};
