// controllers/contact.controller.js
import { ObjectId } from "mongodb";
import sanitizeHtml from "sanitize-html";
import { contacts } from "../config/db.js";
import { findContactById } from "../models/contact.model.js";

export async function submitContact(req, res) {
  const { name, email, phone, subject, message, type } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Name, email, and message are required." });
  }

  try {
    await contacts().insertOne({
      name: sanitizeHtml(name),
      email: sanitizeHtml(email),
      phone: phone ? sanitizeHtml(phone) : null,
      subject: subject ? sanitizeHtml(subject) : "General",
      message: sanitizeHtml(message),
      type: type || "contact",
      isRead: false,
      createdAt: new Date(),
    });
    return res.status(201).json({ message: "Message submitted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getContacts(req, res) {
  const { type } = req.query;

  try {
    const query = type ? { type } : {};
    const result = await contacts()
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json({ contacts: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function markAsRead(req, res) {
  try {
    const contact = await findContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found." });
    }

    await contacts().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isRead: true } },
    );
    return res.status(200).json({ message: "Marked as read." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deleteContact(req, res) {
  try {
    await contacts().deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json({ message: "Message deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
