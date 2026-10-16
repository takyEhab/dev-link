// config/config.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const hasCloudinaryCredentials = Boolean(
  process.env.CLOUD_NAME &&
  process.env.CLOUD_KEY &&
  process.env.CLOUD_SECRET &&
  !process.env.CLOUD_NAME.includes("your_cloudinary") &&
  !process.env.CLOUD_KEY.includes("your_cloudinary") &&
  !process.env.CLOUD_SECRET.includes("your_cloudinary")
);

const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const populateBase64DataUri = (file) => {
  if (file && file.buffer) {
    const mime = file.mimetype || "image/jpeg";
    const dataUri = `data:${mime};base64,${file.buffer.toString("base64")}`;
    file.path = dataUri;
    file.url = dataUri;
    file.secure_url = dataUri;
  }
};

let upload;

if (hasCloudinaryCredentials) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });

    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "portfolio_projects",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
      },
    });

    upload = multer({
      storage,
      limits: { fileSize: 10 * 1024 * 1024 },
    });
  } catch (err) {
    console.warn("Cloudinary configuration failed, using memory storage:", err.message);
  }
}

if (!upload) {
  upload = {
    single: (fieldName) => (req, res, next) => {
      memoryUpload.single(fieldName)(req, res, (err) => {
        if (err) return next(err);
        if (req.file) populateBase64DataUri(req.file);
        next();
      });
    },
    array: (fieldName, maxCount) => (req, res, next) => {
      memoryUpload.array(fieldName, maxCount)(req, res, (err) => {
        if (err) return next(err);
        if (req.files && Array.isArray(req.files)) {
          req.files.forEach(populateBase64DataUri);
        }
        next();
      });
    },
    fields: (fields) => (req, res, next) => {
      memoryUpload.fields(fields)(req, res, (err) => {
        if (err) return next(err);
        if (req.files) {
          Object.values(req.files).flat().forEach(populateBase64DataUri);
        }
        next();
      });
    },
    any: () => (req, res, next) => {
      memoryUpload.any()(req, res, (err) => {
        if (err) return next(err);
        if (req.files && Array.isArray(req.files)) {
          req.files.forEach(populateBase64DataUri);
        }
        next();
      });
    },
  };
}

export { cloudinary, upload };

