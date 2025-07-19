// /pages/api/posts/index.js
import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { method, body } = req;
  const { db } = await connectToDatabase();

  if (method === "GET") {
    try {
      const posts = await db
        .collection("posts")
        .find()
        .sort({ timestamp: -1 })
        .toArray();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (method === "POST") {
    try {
      // Ensure default empty arrays for comments and likes
      const postData = {
        ...body,
        timestamp: new Date().toISOString(),
        comments: body.comments || [],
        likes: body.likes || [],
      };
      const result = await db.collection("posts").insertOne(postData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
