import { contacts } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findContactById(id) {
  return await contacts().findOne({ _id: new ObjectId(id) });
}
