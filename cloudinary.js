// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Can use NEXT_PUBLIC_ here since it's only used server‑side
  api_key: process.env.CLOUDINARY_API_KEY, // Keep secret on server side only
  api_secret: process.env.CLOUDINARY_API_SECRET, // Keep secret on server side only
});

export default cloudinary;
