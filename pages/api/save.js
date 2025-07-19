// /pages/api/posts/save.js
import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, body } = req;

  // Validate required fields
  if (!body.postId || !body.userEmail) {
    return res.status(400).json({ error: "Missing postId or userEmail" });
  }

  const { postId, userEmail } = body;
  const { db } = await connectToDatabase();

  try {
    const user = await db.collection("users").findOne({ email: userEmail });

    if (method === "PUT") {
      // Handle Save
      if (!user) {
        // Create a user entry if it doesn't exist
        await db.collection("users").insertOne({
          email: userEmail,
          savedPosts: [postId],
        });
        return res.status(200).json({ message: "Post saved successfully!" });
      }

      // If user exists, update savedPosts array
      const updatedSavedPosts = user.savedPosts || [];
      if (!updatedSavedPosts.includes(postId)) {
        updatedSavedPosts.push(postId);
        await db
          .collection("users")
          .updateOne(
            { email: userEmail },
            { $set: { savedPosts: updatedSavedPosts } }
          );
        return res.status(200).json({ message: "Post saved successfully!" });
      } else {
        return res.status(400).json({ error: "Post already saved" });
      }
    } else if (method === "DELETE") {
      // Handle Unsave
      if (!user || !user.savedPosts.includes(postId)) {
        return res.status(400).json({ error: "Post not found in savedPosts" });
      }

      const updatedSavedPosts = user.savedPosts.filter((id) => id !== postId);
      await db
        .collection("users")
        .updateOne(
          { email: userEmail },
          { $set: { savedPosts: updatedSavedPosts } }
        );
      return res.status(200).json({ message: "Post unsaved successfully!" });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling save/unsave:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
