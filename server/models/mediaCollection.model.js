import { ObjectId } from "mongodb";
import { mediaCollections } from "../config/db.js";

export async function findCollectionById(id) {
  return await mediaCollections().findOne({ _id: new ObjectId(id) });
}

export async function findCollectionBySlug(slug) {
  return await mediaCollections().findOne({ slug });
}

export async function getAllCollections() {
  return await mediaCollections().find({}).sort({ createdAt: -1 }).toArray();
}
