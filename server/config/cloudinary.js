import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Cloudinary storage configs ──────────────────────────────────────────────

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pastor_akintola/images",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pastor_akintola/sermons",
    resource_type: "video", // REQUIRED: Cloudinary requires "video" as the resource_type for audio uploads. See: https://cloudinary.com/documentation/upload_images#supported_media_types
    allowed_formats: ["mp3", "wav", "m4a", "ogg"],
  },
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pastor_akintola/ebooks",
    resource_type: "raw", // PDFs must use "raw"
    allowed_formats: ["pdf"],
  },
});

const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pastor_akintola/thumbnails",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

// ─── MIME type filters ────────────────────────────────────────────────────────

function imageFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid image format. Only JPG, PNG, and WEBP are allowed."),
      false,
    );
  }
}

function audioFilter(req, file, cb) {
  const allowed = [
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/m4a",
    "audio/x-m4a",
    "audio/ogg",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid audio format. Only MP3, WAV, M4A, and OGG are allowed.",
      ),
      false,
    );
  }
}

function pdfFilter(req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only PDF is allowed."), false);
  }
}

function sermonFileFilter(req, file, cb) {
  if (file.fieldname === "audio") {
    audioFilter(req, file, cb);
  } else if (file.fieldname === "thumbnail") {
    imageFilter(req, file, cb);
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
}

function ebookFileFilter(req, file, cb) {
  if (file.fieldname === "pdf") {
    pdfFilter(req, file, cb);
  } else if (file.fieldname === "cover") {
    imageFilter(req, file, cb);
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
}

// ─── Single-purpose upload instances ─────────────────────────────────────────

// For posts, events, media — single image upload
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

// ─── Sermon upload — audio (required) + thumbnail (optional) ─────────────────

const sermonStorage = {
  _handleFile(req, file, cb) {
    if (file.fieldname === "audio") {
      audioStorage._handleFile(req, file, cb);
    } else {
      thumbnailStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    if (file.fieldname === "audio") {
      audioStorage._removeFile(req, file, cb);
    } else {
      thumbnailStorage._removeFile(req, file, cb);
    }
  },
};

export const uploadSermonFiles = multer({
  storage: sermonStorage,
  fileFilter: sermonFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for audio
}).fields([
  { name: "audio", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// ─── Ebook upload — pdf (required) + cover image (optional) ──────────────────
const ebookStorage = {
  _handleFile(req, file, cb) {
    if (file.fieldname === "pdf") {
      pdfStorage._handleFile(req, file, cb);
    } else {
      imageStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    if (file.fieldname === "pdf") {
      pdfStorage._removeFile(req, file, cb);
    } else {
      imageStorage._removeFile(req, file, cb);
    }
  },
};

// For uploading multiple images at once (e.g., image galleries, multi-image posts)
export const uploadMultipleImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

export const uploadEbookFiles = multer({
  storage: ebookStorage,
  fileFilter: ebookFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for PDF
}).fields([
  { name: "pdf", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]);

// ─── Export cloudinary instance for use in controllers (cleanup) ──────────────
export { cloudinary };
