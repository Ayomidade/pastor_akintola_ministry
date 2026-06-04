import { events } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findEventById(id) {
  return await events().findOne({ _id: new ObjectId(id) });
}

export async function getAllEvents({ page = 1, limit = 10, upcoming }) {
  const query = { isPublished: true };
  if (upcoming) query.date = { $gte: new Date() };

  const skip = (page - 1) * limit;

  // ✅ Fix — run both queries with Promise.all
  const [data, total] = await Promise.all([
    events().find(query).sort({ date: 1 }).skip(skip).limit(limit).toArray(),
    events().countDocuments(query),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function newEvent(eventData) {
  // const data = {
  //   title: eventData.title,
  //   slug: eventData.slug,
  //   description: eventData.description,
  //   date: eventData.date,
  //   time: eventData.time,
  //   location: eventData.location,
  //   category: eventData.category,
  //   image: eventData.image,
  //   isPublished: eventData.isPublished,
  //   createdAt: eventData.createdAt,
  //   updatedAt: eventData.updatedAt,
  // };
  const result = await events().insertOne(eventData);
  return result.insertedId;
}
