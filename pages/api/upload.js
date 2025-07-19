import { IncomingForm } from "formidable";
import cloudinary from "../../lib/cloudinary";

// Disable Next.js's default body parsing so formidable can handle file streams.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Create a new instance of IncomingForm for parsing files.
  const form = new IncomingForm({
    maxFileSize: 2 * 1024 * 1024, // Limit file size to 2MB
    keepExtensions: true, // Keep file extensions
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing files:", err);
      return res.status(500).json({ error: "Error parsing file" });
    }

    // Extract the uploaded file data.
    let fileData = files.file;
    if (Array.isArray(fileData)) {
      fileData = fileData[0]; // Use the first file if multiple files are sent
    }

    if (!fileData) {
      console.error("No file found in form data. Files object:", files);
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate file type before uploading to Cloudinary.
    const mimeType = fileData.mimetype || fileData.type;
    if (!mimeType.startsWith("image/")) {
      console.error("Invalid file type:", mimeType);
      return res.status(400).json({ error: "Only image files are allowed" });
    }

    try {
      // Upload the file to Cloudinary.
      const result = await cloudinary.uploader.upload(fileData.filepath, {
        folder: "your_folder_name", // Replace with your folder name for organization
        resource_type: "image", // Explicitly specify "image" as resource type
      });

      // Respond with the uploaded file's secure URL.
      return res.status(200).json({ url: result.secure_url });
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);
      return res.status(500).json({ error: "Error uploading file" });
    }
  });
}
