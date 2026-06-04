export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(text, collection) {
  let slug = slugify(text);
  let exists = await collection.findOne({ slug });
  let counter = 1;

  while (exists) {
    slug = `${slugify(text)}-${counter}`;
    exists = await collection.findOne({ slug });
    counter++;
  }

  return slug;
}
