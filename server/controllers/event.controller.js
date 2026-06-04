// controllers/event.controller.js
import { ObjectId } from "mongodb";
import { cloudinary } from "../config/cloudinary.js";
import { events } from "../config/db.js";
import {
  findEventById,
  getAllEvents,
  newEvent,
} from "../models/event.model.js";
import { generateUniqueSlug } from "../utils/slugify.js";

export async function createEvent(req, res) {
  const { title, description, date, time, location, category } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: "Title and date are required." });
  }

  try {
    const slug = await generateUniqueSlug(title, events());

    const id = await newEvent({
      title,
      slug,
      description: description || "",
      date: new Date(date),
      time: time || null,
      location: location || null,
      category: category || "General",
      image: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : null,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!id) {
      return res.status(400).json({ message: "An error occurred." });
    }

    return res.status(201).json({ message: "Event created.", eventId: id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getAllEventsAdmin(req, res) {
  try {
    const [result, total] = await Promise.all([
      events().find({}).sort({ date: 1 }).toArray(),
      events().countDocuments(),
    ]);

    return res.status(200).json({ events: result, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getEvents(req, res) {
  const { page, limit, upcoming } = req.query;

  try {
    const result = await getAllEvents({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      upcoming: upcoming === "true",
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getEventBySlug(req, res) {
  try {
    const event = await events().findOne({ slug: req.params.slug });
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.status(200).json({ event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function updateEvent(req, res) {
  const { title, description, date, time, location, category, isPublished } =
    req.body;

  try {
    const event = await findEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const updates = { updatedAt: new Date() };

    if (title) {
      updates.title = title;
      updates.slug = await generateUniqueSlug(title, events());
    }
    if (description) updates.description = description;
    if (date) updates.date = new Date(date);
    if (time) updates.time = time;
    if (location) updates.location = location;
    if (category) updates.category = category;
    if (isPublished !== undefined) updates.isPublished = isPublished === "true";

    if (req.file) {
      if (event.image?.publicId) {
        await cloudinary.uploader.destroy(event.image.publicId);
      }
      updates.image = { url: req.file.path, publicId: req.file.filename };
    }

    await events().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
    );
    return res.status(200).json({ message: "Event updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deleteEvent(req, res) {
  try {
    const event = await findEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.image?.publicId) {
      await cloudinary.uploader.destroy(event.image.publicId);
    }
    await events().deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json({ message: "Event deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
