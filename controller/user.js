const User = require("../models/usermodel");

const getSelf = async (req, res) => {
  const user = await User.findById({ _id: req.user.id }).select("-password");
  res.json(user);
};
const follow = async (req, res) => {
  const deselect = "-password -createdAt -updatedAt -__v";
  const { followerId, followingId } = req.body;

  //unfollow
  if (await User.findOne({ _id: followingId, followers: followerId })) {
    const follower = await User.findByIdAndUpdate(
      { _id: followerId },
      {
        $pull: {
          following: followingId,
        },
        $inc: { followingCount: -1 },
      },
      {
        new: true,
      }
    ).select(deselect);
    const following = await User.findByIdAndUpdate(
      { _id: followingId },
      {
        $pull: {
          followers: followerId,
        },
        $inc: { followersCount: -1 },
      },
      {
        new: true,
      }
    ).select(deselect);
    return res.json({ follower, following });
  }

  //follow
  const follower = await User.findByIdAndUpdate(
    { _id: followerId },
    {
      $push: {
        following: followingId,
      },
      $inc: { followingCount: 1 },
    },
    {
      new: true,
    }
  )
    .select(deselect)
    .populate({
      path: "following",
      select: deselect,
    });
  const following = await User.findByIdAndUpdate(
    { _id: followingId },
    {
      $push: {
        followers: followerId,
      },
      $inc: { followersCount: 1 },
    },
    {
      new: true,
    }
  )
    .select(deselect)
    .populate({
      path: "followers",
      select: deselect,
    });
  res.json({ follower, following });
};
module.exports = { getSelf, follow };
