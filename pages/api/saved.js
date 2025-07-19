// /pages/api/posts/saved.js
import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userEmail } = query;

  if (!userEmail) {
    return res.status(400).json({ error: "Missing userEmail parameter" });
  }

  const { db } = await connectToDatabase();

  try {
    const user = await db.collection("users").findOne({ email: userEmail });

    if (!user || !user.savedPosts) {
      return res.status(404).json({ error: "No saved posts found" });
    }

    // Convert string post IDs to ObjectId and fetch posts details.
    const savedPosts = await db
      .collection("posts")
      .find({ _id: { $in: user.savedPosts.map((id) => new ObjectId(id)) } })
      .toArray();

    return res.status(200).json({ savedPosts });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
