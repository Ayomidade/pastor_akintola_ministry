import { likes } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function hasUserLiked(postId, identifier) {
  return await likes().findOne({
    postId: new ObjectId(postId),
    identifier,
  });
}

export async function addLike(postId, identifier) {
  return await likes().insertOne({
    postId: new ObjectId(postId),
    identifier,
    createdAt: new Date(),
  });
}
