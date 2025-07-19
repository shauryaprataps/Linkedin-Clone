// /pages/api/posts/like.js
import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { postId, userEmail, like } = body;
  if (!postId || !userEmail || typeof like !== "boolean") {
    return res.status(400).json({ error: "Missing or invalid parameters" });
  }

  const { db } = await connectToDatabase();

  try {
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(postId),
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let updatedLikes = post.likes || [];

    if (like) {
      if (!updatedLikes.includes(userEmail)) {
        updatedLikes.push(userEmail);
      }
    } else {
      updatedLikes = updatedLikes.filter((email) => email !== userEmail);
    }

    await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $set: { likes: updatedLikes } }
      );
    return res.status(200).json({ likes: updatedLikes });
  } catch (error) {
    console.error("Error updating like:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
