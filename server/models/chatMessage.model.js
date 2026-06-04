import { chatMessages } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function getMessagesBySession(sessionId) {
  return await chatMessages()
    .find({ sessionId: new ObjectId(sessionId) })
    .sort({ createdAt: 1 })
    .toArray();
}
