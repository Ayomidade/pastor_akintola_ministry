import { comments } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function getCommentsByPost(postId) {
  // const comments = getCommentCollection();
  const all = await comments()
    .find({ postId: new ObjectId(postId), isApproved: true })
    .sort({ createdAt: 1 })
    .toArray();

  // Group replies under parents
  const parents = all.filter((c) => !c.parentId);
  const replies = all.filter((c) => c.parentId);

  return parents.map((parent) => ({
    ...parent,
    replies: replies.filter(
      (r) => r.parentId.toString() === parent._id.toString(),
    ),
  }));
}

export async function findCommentById(id) {
  return await comments().findOne({ _id: new ObjectId(id) });
}

export async function deleteCommentWithReplies(commentId) {
  // const comments = comments();
  const id = new ObjectId(commentId);
  await comments().deleteMany({
    $or: [{ _id: id }, { parentId: id }],
  });
}
