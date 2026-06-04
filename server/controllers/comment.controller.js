// controllers/comment.controller.js
import { ObjectId } from "mongodb";
import sanitizeHtml from "sanitize-html";
import { comments } from "../config/db.js";
import {
  getCommentsByPost,
  findCommentById,
  deleteCommentWithReplies,
} from "../models/comment.model.js";
import { findPostById } from "../models/post.model.js";

export async function addComment(req, res) {
  const { name, email, body, parentId } = req.body;
  const { postId } = req.params;

  if (!name || !email || !body) {
    return res
      .status(400)
      .json({ message: "Name, email, and comment body are required." });
  }

  try {
    const post = await findPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    await comments().insertOne({
      postId: new ObjectId(postId),
      parentId: parentId ? new ObjectId(parentId) : null,
      name: sanitizeHtml(name),
      email: sanitizeHtml(email),
      body: sanitizeHtml(body),
      isApproved: false,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Comment submitted for approval." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getComments(req, res) {
  try {
    const result = await getCommentsByPost(req.params.postId);
    return res.status(200).json({ comments: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getAllCommentsAdmin(req, res) {
  try {
    const result = await comments().find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ comments: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function approveComment(req, res) {
  try {
    const comment = await findCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    await comments().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isApproved: true } },
    );
    return res.status(200).json({ message: "Comment approved." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deleteComment(req, res) {
  try {
    const comment = await findCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    await deleteCommentWithReplies(req.params.id);
    return res.status(200).json({ message: "Comment and replies deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
