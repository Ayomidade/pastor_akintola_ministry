// controllers/post.controller.js
import sanitizeHtml from "sanitize-html";
import { ObjectId } from "mongodb";
import { cloudinary } from "../config/cloudinary.js";
import { posts } from "../config/db.js";
import {
  findPostById,
  findPostBySlug,
  getAllPosts,
} from "../models/post.model.js";
import { generateUniqueSlug } from "../utils/slugify.js";

export async function createPost(req, res) {
  const { title, content, category, postType, scripture, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const slug = await generateUniqueSlug(title, posts());

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "h1",
        "h2",
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt"],
      },
    });

    const post = {
      title,
      slug,
      content: sanitizedContent,
      category: category || "General",
      postType: postType || "article",
      scripture: scripture || null,
      tags: tags ? JSON.parse(tags) : [],
      featuredImage: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : null,
      isPublished: false,
      likesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await posts().insertOne(post);
    return res
      .status(201)
      .json({ message: "Post created.", postId: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getPosts(req, res) {
  const { page, limit, category, published } = req.query;

  try {
    const result = await getAllPosts({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      published:
        published === "true" ? true : published === "false" ? false : undefined,
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getPostBySlug(req, res) {
  try {
    const post = await findPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getPostById(req, res) {
  try {
    const post = await findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function updatePost(req, res) {
  const { title, content, category, postType, scripture, tags, isPublished } =
    req.body;

  try {
    const post = await findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const updates = { updatedAt: new Date() };

    if (title) {
      updates.title = title;
      updates.slug = await generateUniqueSlug(title, posts());
    }
    if (content) {
      updates.content = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img",
          "h1",
          "h2",
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt"],
        },
      });
    }
    if (category) updates.category = category;
    if (postType) updates.postType = postType;
    if (scripture !== undefined) updates.scripture = scripture;
    if (tags) updates.tags = JSON.parse(tags);
    if (isPublished !== undefined) updates.isPublished = isPublished === "true";

    if (req.file) {
      if (post.featuredImage?.publicId) {
        await cloudinary.uploader.destroy(post.featuredImage.publicId);
      }
      updates.featuredImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    await posts().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
    );
    return res.status(200).json({ message: "Post updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.featuredImage?.publicId) {
      await cloudinary.uploader.destroy(post.featuredImage.publicId);
    }

    await posts().deleteOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function togglePublish(req, res) {
  try {
    const post = await findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    await posts().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isPublished: !post.isPublished, updatedAt: new Date() } },
    );
    return res.status(200).json({
      message: `Post ${!post.isPublished ? "published" : "unpublished"}.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
