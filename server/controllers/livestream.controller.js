// controllers/livestream.controller.js
import { ObjectId } from "mongodb";
import { livestreams } from "../config/db.js";
import { getActiveLivestream } from "../models/livestream.model.js";

export async function setLivestream(req, res) {
  const { youtubeUrl, title } = req.body;

  if (!youtubeUrl) {
    return res.status(400).json({ message: "YouTube URL is required." });
  }

  try {
    await livestreams().updateMany({}, { $set: { isActive: false } });
    const result = await livestreams().insertOne({
      youtubeUrl,
      title: title || "Live Service",
      isActive: true,
      createdAt: new Date(),
    });
    return res
      .status(201)
      .json({ message: "Livestream set.", id: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getActiveLivestreamController(req, res) {
  try {
    const stream = await getActiveLivestream();
    return res.status(200).json({ livestream: stream || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deactivateLivestream(req, res) {
  try {
    await livestreams().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isActive: false } },
    );
    return res.status(200).json({ message: "Livestream deactivated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
