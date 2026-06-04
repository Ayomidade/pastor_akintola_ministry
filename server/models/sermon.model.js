import { sermons } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findSermonById(id) {
  return await sermons().findOne({ _id: new ObjectId(id) });
}

export async function findSermonBySlug(slug) {
  return await sermons().findOne({ slug });
}

export async function getAllSermons({
  page = 1,
  limit = 10,
  series,
  published,
}) {
  const query = {};
  if (series) query.series = series;
  if (published !== undefined) query.isPublished = published;

  const skip = (page - 1) * limit;
  // const sermons = getSermonCollection();

  // ✅ Fix — run both queries with Promise.all
  const [data, total] = await Promise.all([
    sermons().find(query).sort({ date: 1 }).skip(skip).limit(limit).toArray(),
    sermons().countDocuments(query),
  ]);
  return { data, total, page, totalPages: Math.ceil(total / limit) };
}
