// controllers/newsletter.controller.js
import { newsletter } from "../config/db.js";
import { findSubscriberByEmail } from "../models/newsletter.model.js";

export async function subscribe(req, res) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const existing = await findSubscriberByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already subscribed." });
    }

    await newsletter().insertOne({
      email,
      name: name || null,
      subscribedAt: new Date(),
    });
    return res.status(201).json({ message: "Subscribed successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getSubscribers(req, res) {
  try {
    const subscribers = await newsletter()
      .find({})
      .sort({ subscribedAt: -1 })
      .toArray();
    return res.status(200).json({ subscribers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function unsubscribe(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    await newsletter().deleteOne({ email });
    return res.status(200).json({ message: "Unsubscribed." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
