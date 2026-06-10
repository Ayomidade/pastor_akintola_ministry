import { media } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findMediaById(id) {
  return await media().findOne({ _id: new ObjectId(id) });
}

export async function getMediaByCollection(collectionId) {
  return await media()
    .find({ collectionId: new ObjectId(collectionId) })
    .sort({ createdAt: 1 })
    .toArray();
}

export async function getUncategorizedMedia() {
  return await media()
    .find({ collectionId: null })
    .sort({ createdAt: -1 })
    .toArray();
}