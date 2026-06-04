// controllers/like.controller.js
import { ObjectId } from "mongodb";
import { posts } from "../config/db.js";
import { hasUserLiked, addLike } from "../models/like.model.js";
import { findPostById } from "../models/post.model.js";

export async function likePost(req, res) {
  const { postId } = req.params;
  const identifier = req.ip + req.headers["user-agent"];

  try {
    const post = await findPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const alreadyLiked = await hasUserLiked(postId, identifier);
    if (alreadyLiked) {
      return res
        .status(409)
        .json({ message: "You have already liked this post." });
    }

    await addLike(postId, identifier);
    await posts().updateOne(
      { _id: new ObjectId(postId) },
      { $inc: { likesCount: 1 } },
    );

    return res.status(200).json({ message: "Post liked." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
