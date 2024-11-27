import { createRouter } from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import cloudinary from "../lib/cloudinary";
// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // Local destination folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique file name
  },
});

// File type and size validation middleware
const fileFilter:any = (req: NextApiRequest, file: Express.Multer.File, cb: Function) => {
  // Check if file is an image or video
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    return cb(null, true); // Accept the file
  } else {
    return cb(new Error("Invalid file type. Only images and videos are allowed."), false); // Reject the file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // Limit the file size to 8MB
});

// Create a next-connect handler using createRouter
const handler = createRouter<NextApiRequest, NextApiResponse>();

// Global error handling middleware
handler.handler({
  onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
    console.error(err); // log the error for debugging
    if (err.message.includes("Invalid file type")) {
      res.status(400).json({ error: "Invalid file type. Only images and videos are allowed." });
    } else if (err.message.includes("File too large")) {
      res.status(400).json({ error: "File is too large. Maximum size is 8MB." });
    } else {
      res.status(500).json({ error: `Something went wrong! ${err.message}` });
    }
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
});

// Middleware to handle file uploads
handler.use((req, res, next) => {
  upload.single("file")(req as any, res as any, next);
});

// POST request handler
handler.post(async (req: any, res: NextApiResponse) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Upload file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto", // Cloudinary recognizes it as an image/video
    });

    // After successful upload to Cloudinary, delete the file from local folder
    const localPath = path.join("./public/uploads", file.filename);
    fs.unlinkSync(localPath); // Delete the file from the local uploads folder

    // Return the response with Cloudinary URL
    res.status(200).json({
      message: "File uploaded and deleted from local storage successfully",
      file: {
        name: file.originalname,
        path: cloudinaryResponse.secure_url, // Return the Cloudinary URL
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error uploading to Cloudinary" });
  }
});

export default handler;

// Disable Next.js default body parser (to avoid conflict with multer)
export const config = {
  api: {
    bodyParser: false,
  },
};
