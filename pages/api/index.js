import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { sender, receiver } = req.body;
      if (!sender || !receiver) {
        return res.status(400).json({ message: "Missing sender or receiver" });
      }

      const client = await clientPromise;
      const db = client.db();

      // For uniqueness, sort IDs and store them in a "users" array.
      const sortedUsers = [sender, receiver].sort();

      // Check if a connection document already exists.
      const existing = await db.collection("connections").findOne({
        users: sortedUsers,
      });
      if (existing) {
        // If it exists and was rejected, you might want to allow a new request.
        if (existing.status === "rejected") {
          await db
            .collection("connections")
            .updateOne(
              { _id: existing._id },
              {
                $set: {
                  status: "pending",
                  requester: sender,
                  createdAt: new Date(),
                },
              }
            );
          return res.status(200).json({ message: "Re-request sent" });
        }
        return res
          .status(200)
          .json({ message: "Already connected or pending" });
      }

      const connection = {
        users: sortedUsers, // e.g. ["USER_A", "USER_B"]
        requester: sender, // Who initiated the request
        status: "pending", // initially a pending request
        createdAt: new Date(),
      };

      const result = await db.collection("connections").insertOne(connection);
      return res
        .status(201)
        .json({ message: "Request sent", id: result.insertedId });
    } catch (error) {
      console.error("Error creating connection:", error);
      return res
        .status(500)
        .json({ message: "Internal error", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}
