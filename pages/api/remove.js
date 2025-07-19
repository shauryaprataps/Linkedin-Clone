// pages/api/connections/remove.js
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const { user1, user2 } = req.body;
      if (!user1 || !user2) {
        return res.status(400).json({ message: "Missing user IDs" });
      }

      // Sort the two IDs so that ordering is consistent.
      const sortedUsers = [user1, user2].sort();

      const client = await clientPromise;
      const db = client.db();

      const result = await db
        .collection("connections")
        .deleteOne({ users: sortedUsers });

      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Connection removed" });
      } else {
        return res.status(404).json({ message: "Connection not found" });
      }
    } catch (error) {
      console.error("Error removing connection:", error);
      return res
        .status(500)
        .json({ message: "Internal error", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}
