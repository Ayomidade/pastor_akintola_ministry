// controllers/media.controller.js
import { ObjectId } from "mongodb";
import { cloudinary } from "../config/cloudinary.js";
import { media } from "../config/db.js";
import { findMediaById } from "../models/media.model.js";

export async function uploadMedia(req, res) {
  console.log("=== UPLOAD MEDIA DEBUG ===");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);
  console.log("req.files length:", req.files ? req.files.length : "no files");

  const { caption, type } = req.body || {};

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one file is required." });
  }

  console.log("caption:", caption, "type:", type);
  try {
    const documents = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      caption: caption || null,
      type: type || "image",
      createdAt: new Date(),
    }));

    const result = await media().insertMany(documents);

    return res.status(201).json({
      message: `${result.insertedCount} file(s) uploaded successfully.`,
      mediaIds: Object.values(result.insertedIds),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getMedia(req, res) {
  const { type } = req.query;

  try {
    const query = type ? { type } : {};
    const result = await media().find(query).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ media: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deleteMedia(req, res) {
  try {
    const item = await findMediaById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Media not found." });
    }

    await cloudinary.uploader.destroy(item.publicId);
    await media().deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json({ message: "Media deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deleteMultipleMedia(req, res) {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "An array of IDs is required." });
  }

  try {
    // Fetch all matching documents to get their publicIds
    const objectIds = ids.map((id) => new ObjectId(id));
    const items = await media()
      .find({ _id: { $in: objectIds } })
      .toArray();

    if (items.length === 0) {
      return res.status(404).json({ message: "No media found for given IDs." });
    }

    // Delete from Cloudinary in parallel
    await Promise.all(
      items.map((item) => cloudinary.uploader.destroy(item.publicId)),
    );

    // Delete from MongoDB
    await media().deleteMany({ _id: { $in: objectIds } });

    return res.status(200).json({
      message: `${items.length} file(s) deleted successfully.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
