import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
const blogUploadsDir = path.join(uploadDir, "blog-images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(blogUploadsDir)) {
  fs.mkdirSync(blogUploadsDir, { recursive: true });
}

// Configure storage for blog images
const blogImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, blogUploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with original extension
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${uniqueId}${extension}`;
    cb(null, filename);
  }
});

// File filter to only allow image files
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

// Create multer upload instance for blog images
export const blogImageUpload = multer({
  storage: blogImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: imageFileFilter,
});

// Middleware to handle blog image uploads
export const uploadBlogImage = (req: Request, res: Response, next: NextFunction) => {
  // Use .single for a single file upload with field name 'image'
  const upload = blogImageUpload.single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error("Multer error:", err.message);
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // An unknown error occurred
      console.error("Unknown upload error:", err);
      return res.status(500).json({
        success: false,
        message: `Upload failed: ${err.message}`,
      });
    }

    // Everything went fine, proceed
    next();
  });
};

// Function to get URL path for an uploaded file
export const getUploadedFilePath = (filename: string, type: 'blog-image') => {
  if (!filename) return null;
  
  const baseDir = type === 'blog-image' ? 'blog-images' : '';
  return `/uploads/${baseDir}/${filename}`;
};