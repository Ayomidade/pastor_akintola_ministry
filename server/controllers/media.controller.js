// controllers/media.controller.js
import { ObjectId } from "mongodb";
import { cloudinary } from "../config/cloudinary.js";
import { media, mediaCollections } from "../config/db.js";
import { findMediaById, getMediaByCollection } from "../models/media.model.js";
import { generateUniqueSlug } from "../utils/slugify.js";
import {
  findCollectionById,
  findCollectionBySlug,
  getAllCollections,
} from "../models/mediaCollection.model.js";

// ─── Media (Images) ───────────────────────────────────────────────
export async function uploadMedia(req, res) {
  const { caption, collectionId } = req.body || {};

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one file is required." });
  }

  if (!collectionId) {
    return res.status(400).json({ message: "CollectionId is required." });
  }

  try {
    const collection = await findCollectionById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    const documents = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      caption: caption || null,
      collectionId: new ObjectId(collectionId),
      createdAt: new Date(),
    }));

    const result = await media().insertMany(documents);
    const insertedIds = Object.values(result.insertedIds);

    if (!collection.coverImage) {
      await mediaCollections().updateOne(
        { _id: new ObjectId(collectionId) },
        {
          $set: {
            coverImage: {
              url: documents[0].url,
              publicId: documents[0].publicId,
            },
            updatedAt: new Date(),
          },
        },
      );
    }

    // Increment imageCount
    await mediaCollections().updateOne(
      { _id: new ObjectId(collectionId) },
      {
        $inc: { imageCount: documents.length },
        $set: { updatedAt: new Date() },
      },
    );

    return res.status(201).json({
      message: `${result.insertedCount} image(s) uploaded.`,
      mediaIds: insertedIds,
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

export async function getCollectionMedia(req, res) {
  try {
    const collection = await findCollectionById(req.params.collectionId);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    const images = await getMediaByCollection(req.params.collectionId);

    return res.status(200).json({ collection, images });
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

    if (item.collectionId) {
      const collection = await findCollectionById(item.collectionId.toString());

      // Decrement collection imageCount
      await mediaColllection().updateOne(
        { _id: item.collectionId },
        {
          $inc: { imageCount: -1 },
          $set: { updatedAt: new Date() },
        },
      );

      // reassign coverImage if deleted image was the coverImage
      if (collection?.coverImage?.publicId === item.publicId) {
        const nextImage = await media().findOne({
          collectionId: item.collectionId,
          _id: new ObjectId(req.params.id),
        });
        await mediaCollection.updateOne(
          { _id: item.collectionId },
          {
            $set: {
              coverImage: nextImage
                ? { url: nextImage.url, publicId: nextImage.publicId }
                : null,
            },
          },
        );
      }
    }

    return res.status(200).json({ message: "Image deleted." });
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

    // Delete from Cloudinary
    await Promise.all(
      items.map((item) => cloudinary.uploader.destroy(item.publicId)),
    );

    // Delete from MongoDB
    await media().deleteMany({ _id: { $in: objectIds } });

    // update imageCount for affected collection
    const collectionIds = [
      ...new Set(
        items
          .filter((i) => i.collectionId)
          .map((i) => i.collectionId.toString()),
      ),
    ];

    await Promise.all(
      collectionIds.map(async (colId) => {
        // length of deleted in a collection
        const deletedInCol = items.filter(
          (i) => i.collectionId?.toString() === colId,
        ).length;

        const collection = findCollectionById(colId);

        // check if coverImage is deleted
        const coverDeleted = items.some(
          (i) => i.publicId === collection?.coverImage?.publicId,
        );

        const updatedFields = {
          updatedAt: new Date(),
        };

        // re-assign coverImage (if needed)
        if (coverDeleted) {
          const nextImage = await media().findOne({
            collectionId: new ObjectId(colId),
          });
          updatedFields.coverImage = nextImage
            ? { url: nextImage.url, publicId: nextImage.publicId }
            : null;
        }

        await mediaCollections().updateOne(
          { _id: new ObjectId(colId) },
          {
            $inc: { imageCount: -deletedInCol },
            $set: updatedFields,
          },
        );
      }),
    );
    return res.status(200).json({
      message: `${items.length} images(s) deleted successfully.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

// ─── Collections ───────────────────────────────────────────────
export async function createCollection(req, res) {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Collection title is required." });
  }

  try {
    const slug = await generateUniqueSlug(title, mediaCollections());
    const result = await mediaCollections().insertOne({
      title,
      slug,
      description: description || "",
      coverImage: null, // set automatically when first image is uploaded
      imageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const collection = await findCollectionById(result.insertedId.toString());

    return res.status(201).json({ message: "Collection created.", collection });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error.");
  }
}

export async function getCollections(req, res) {
  try {
    const collections = await getAllCollections();
    return res.status(200).json({ collections });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error.");
  }
}

export async function getCollectionBySlug(req, res) {
  try {
    const collection = await findCollectionBySlug(req.params.slug);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    const images = await getMediaByCollection(collection._id.toString());
    return res.status(200).json({ collection, images });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error.");
  }
}

export async function updateCollection(req, res) {
  const { title, description } = req.body;
  try {
    const collection = await findCollectionById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    const updates = { updatedAt: new Date() };
    if (title) {
      updates.title = title;
      updates.slug = await generateUniqueSlug(title, mediaCollections());
    }
    if (description !== undefined) {
      updates.description = description;
    }

    await mediaCollections().updateOne({
      _id: new ObjectId(req.params.id),
      $set: updates,
    });

    return res.status(200).json({ message: "Collection updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error.");
  }
}

export async function deleteCollection(req, res) {
  try {
    const collection = await findCollectionById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    const images = await getMediaByCollection(req.params.id);

    // deleting the collection images from cloudinary
    await Promise.all(
      images.map((img) => cloudinary.uploader.destroy(img.publicId)),
    );

    // deleting the collection images from db
    await media().deleteMany({ collectionId: new ObjectId(req.params.id) });

    // deleting the collection from db
    await mediaCollections().deleteOne({ _id: new ObjectId(req.params.id) });

    return res
      .status(200)
      .json({ message: "Collection and all its images deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error.");
  }
}
