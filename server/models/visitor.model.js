import { visitors } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findVisitorByEmail(email) {
  return await visitors().findOne({ email });
}

export async function findVisitorById(id) {
  return await visitors().findOne({ _id: new ObjectId(id) });
}

export async function createVisitor(data) {
  const result = await visitors().insertOne({
    ...data,
    createdAt: new Date(),
  });
  return result;
}
