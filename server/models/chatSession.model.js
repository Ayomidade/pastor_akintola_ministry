import { chatSessions } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findSessionById(id) {
  return await chatSessions().findOne({ _id: new ObjectId(id) });
}

export async function findSessionByVisitor(visitorId) {
  return await chatSessions().findOne({
    visitorId: new ObjectId(visitorId),
    status: { $in: ["open", "active"] },
  });
}
