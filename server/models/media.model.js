import { media } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findMediaById(id) {
  return await media().findOne({ _id: new ObjectId(id) });
}
