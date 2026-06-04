// controllers/chat.controller.js
import { ObjectId } from "mongodb";
import { chatSessions, chatMessages } from "../config/db.js";
import {
  findSessionById,
  findSessionByVisitor,
} from "../models/chatSession.model.js";
import { getMessagesBySession } from "../models/chatMessage.model.js";

export async function startSession(req, res) {
  const visitorId = req.visitor.id;
  const visitorName = req.visitor.name;

  try {
    const existing = await findSessionByVisitor(visitorId);
    if (existing) {
      return res
        .status(200)
        .json({ message: "Session already open.", session: existing });
    }

    const result = await chatSessions().insertOne({
      visitorId: new ObjectId(visitorId),
      visitorName,
      status: "open",
      isReadByAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const session = await findSessionById(result.insertedId.toString());
    return res.status(201).json({ message: "Chat session started.", session });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getMySession(req, res) {
  try {
    const session = await findSessionByVisitor(req.visitor.id);
    if (!session) {
      return res.status(404).json({ message: "No active session found." });
    }
    return res.status(200).json({ session });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getAllSessions(req, res) {
  try {
    const sessions = await chatSessions()
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();
    return res.status(200).json({ sessions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getSessionMessages(req, res) {
  try {
    const session = await findSessionById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const messages = await getMessagesBySession(req.params.sessionId);
    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function closeSession(req, res) {
  try {
    await chatSessions().updateOne(
      { _id: new ObjectId(req.params.sessionId) },
      { $set: { status: "closed", updatedAt: new Date() } },
    );
    return res.status(200).json({ message: "Session closed." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getUnreadCount(req, res) {
  try {
    const count = await chatSessions().countDocuments({
      isReadByAdmin: false,
      status: { $in: ["open", "active"] },
    });
    return res.status(200).json({ unreadCount: count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
