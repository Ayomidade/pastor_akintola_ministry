import { posts } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findPostById(id) {
  return await posts().findOne({ _id: new ObjectId(id) });
}

export async function findPostBySlug(slug) {
  return await posts().findOne({ slug });
}

export async function getAllPosts({
  page = 1,
  limit = 10,
  category,
  published,
}) {
  const query = {};
  if (category) query.category = category;
  if (published !== undefined) query.isPublished = published;

  const skip = (page - 1) * limit;

  // ✅ Fix — run both queries with Promise.all
  const [data, total] = await Promise.all([
    posts().find(query).sort({ date: 1 }).skip(skip).limit(limit).toArray(),
    posts().countDocuments(query),
  ]);
  return { data, total, page, totalPages: Math.ceil(total / limit) };
}
