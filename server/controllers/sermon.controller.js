// controllers/sermon.controller.js
import { ObjectId } from "mongodb";
import { cloudinary } from "../config/cloudinary.js";
import { sermons } from "../config/db.js";
import { findSermonById, getAllSermons } from "../models/sermon.model.js";
import { generateUniqueSlug } from "../utils/slugify.js";

export async function createSermon(req, res) {
  const { title, description, preacher, series, date, tags } = req.body;

  if (!title || !req.files?.audio) {
    return res
      .status(400)
      .json({ message: "Title and audio file are required." });
  }

  try {
    const slug = await generateUniqueSlug(title, sermons());

    const sermon = {
      title,
      slug,
      description: description || "",
      preacher: preacher || "Pastor Daniel Akintola",
      series: series || null,
      date: date ? new Date(date) : new Date(),
      tags: tags ? JSON.parse(tags) : [],
      audio: {
        url: req.files.audio[0].path,
        publicId: req.files.audio[0].filename,
      },
      thumbnail: req.files?.thumbnail
        ? {
            url: req.files.thumbnail[0].path,
            publicId: req.files.thumbnail[0].filename,
          }
        : null,
      isPublished: false,
      listenCount: 0,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await sermons().insertOne(sermon);
    return res
      .status(201)
      .json({ message: "Sermon created.", sermonId: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getSermons(req, res) {
  const { page, limit, series, published } = req.query;

  try {
    const result = await getAllSermons({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      series,
      published:
        published === "true" ? true : published === "false" ? false : undefined,
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getSermonBySlug(req, res) {
  try {
    const sermon = await sermons().findOne({ slug: req.params.slug });
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found." });
    }
    return res.status(200).json({ sermon });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function updateSermon(req, res) {
  const { title, description, preacher, series, date, tags, isPublished } =
    req.body;

  try {
    const sermon = await findSermonById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found." });
    }

    const updates = { updatedAt: new Date() };

    if (title) {
      updates.title = title;
      updates.slug = await generateUniqueSlug(title, sermons());
    }
    if (description) updates.description = description;
    if (preacher) updates.preacher = preacher;
    if (series) updates.series = series;
    if (date) updates.date = new Date(date);
    if (tags) updates.tags = JSON.parse(tags);
    if (isPublished !== undefined) updates.isPublished = isPublished === "true";

    if (req.files?.audio) {
      if (sermon.audio?.publicId) {
        await cloudinary.uploader.destroy(sermon.audio.publicId, {
          resource_type: "video",
        });
      }
      updates.audio = {
        url: req.files.audio[0].path,
        publicId: req.files.audio[0].filename,
      };
    }
    if (req.files?.thumbnail) {
      if (sermon.thumbnail?.publicId) {
        await cloudinary.uploader.destroy(sermon.thumbnail.publicId);
      }
      updates.thumbnail = {
        url: req.files.thumbnail[0].path,
        publicId: req.files.thumbnail[0].filename,
      };
    }

    await sermons().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
    );
    return res.status(200).json({ message: "Sermon updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deleteSermon(req, res) {
  try {
    const sermon = await findSermonById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found." });
    }

    if (sermon.audio?.publicId) {
      await cloudinary.uploader.destroy(sermon.audio.publicId, {
        resource_type: "video",
      });
    }
    if (sermon.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(sermon.thumbnail.publicId);
    }

    await sermons().deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json({ message: "Sermon deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function togglePublish(req, res) {
  try {
    const sermon = await findSermonById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found." });
    }

    await sermons().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isPublished: !sermon.isPublished, updatedAt: new Date() } },
    );
    return res.status(200).json({
      message: `Sermon ${!sermon.isPublished ? "published" : "unpublished"}.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function incrementListenCount(req, res) {
  try {
    await sermons().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { listenCount: 1 } },
    );
    return res.status(200).json({ message: "Listen count updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function incrementDownloadCount(req, res) {
  try {
    await sermons().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { downloadCount: 1 } },
    );
    return res.status(200).json({ message: "Download count updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
