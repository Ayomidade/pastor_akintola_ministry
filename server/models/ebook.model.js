import { ebooks } from "../config/db.js";
import { ObjectId } from "mongodb";


export async function findEbookById(id) {
  return await ebooks().findOne({ _id: new ObjectId(id) });
}

export async function findEbookBySlug(slug) {
  return await ebooks().findOne({ slug });
}

export async function getAllEbooks({ page = 1, limit = 10, published }) {
  const query = {};
  if (published !== undefined) query.isPublished = published;

  const skip = (page - 1) * limit;
  // const ebooks = getEbookCollection();

 // ✅ Fix — run both queries with Promise.all
const [data, total] = await Promise.all([
  ebooks().find(query).sort({ date: 1 }).skip(skip).limit(limit).toArray(),
  ebooks().countDocuments(query),
]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}
