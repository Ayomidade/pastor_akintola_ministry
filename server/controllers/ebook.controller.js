// controllers/ebook.controller.js
import { ObjectId } from "mongodb";
import { cloudinary } from "../config/cloudinary.js";
import { ebooks } from "../config/db.js";
import { findEbookById, getAllEbooks } from "../models/ebook.model.js";
import { generateUniqueSlug } from "../utils/slugify.js";

export async function uploadEbook(req, res) {
  const { title, author, description, category, isFree } = req.body;

  if (!title || !req.files?.pdf) {
    return res
      .status(400)
      .json({ message: "Title and PDF file are required." });
  }

  try {
    const slug = await generateUniqueSlug(title, ebooks());

    const ebook = {
      title,
      slug,
      author: author || "Pastor Daniel Akintola",
      description: description || "",
      category: category || "General",
      isFree: isFree !== "false",
      file: {
        url: req.files.pdf[0].path,
        publicId: req.files.pdf[0].filename,
      },
      coverImage: req.files?.cover
        ? {
            url: req.files.cover[0].path,
            publicId: req.files.cover[0].filename,
          }
        : null,
      isPublished: false,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ebooks().insertOne(ebook);
    return res
      .status(201)
      .json({ message: "Ebook uploaded.", ebookId: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getEbooks(req, res) {
  const { page, limit, published } = req.query;

  try {
    const result = await getAllEbooks({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      published:
        published === "true" ? true : published === "false" ? false : undefined,
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getEbookBySlug(req, res) {
  try {
    const ebook = await ebooks().findOne({ slug: req.params.slug });
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found." });
    }
    return res.status(200).json({ ebook });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function updateEbook(req, res) {
  const { title, author, description, category, isFree, isPublished } =
    req.body;

  try {
    const ebook = await findEbookById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found." });
    }

    const updates = { updatedAt: new Date() };

    if (title) {
      updates.title = title;
      updates.slug = await generateUniqueSlug(title, ebooks());
    }
    if (author) updates.author = author;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (isFree !== undefined) updates.isFree = isFree !== "false";
    if (isPublished !== undefined) updates.isPublished = isPublished === "true";

    if (req.files?.pdf) {
      if (ebook.file?.publicId) {
        await cloudinary.uploader.destroy(ebook.file.publicId, {
          resource_type: "raw",
        });
      }
      updates.file = {
        url: req.files.pdf[0].path,
        publicId: req.files.pdf[0].filename,
      };
    }
    if (req.files?.cover) {
      if (ebook.coverImage?.publicId) {
        await cloudinary.uploader.destroy(ebook.coverImage.publicId);
      }
      updates.coverImage = {
        url: req.files.cover[0].path,
        publicId: req.files.cover[0].filename,
      };
    }

    await ebooks().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
    );
    return res.status(200).json({ message: "Ebook updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deleteEbook(req, res) {
  try {
    const ebook = await findEbookById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found." });
    }

    if (ebook.file?.publicId) {
      await cloudinary.uploader.destroy(ebook.file.publicId, {
        resource_type: "raw",
      });
    }
    if (ebook.coverImage?.publicId) {
      await cloudinary.uploader.destroy(ebook.coverImage.publicId);
    }

    await ebooks().deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json({ message: "Ebook deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function incrementDownloadCount(req, res) {
  try {
    await ebooks().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { downloadCount: 1 } },
    );
    return res.status(200).json({ message: "Download count updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
