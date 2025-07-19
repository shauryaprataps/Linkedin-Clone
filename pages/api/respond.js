import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      // Expecting: requester (the user who initiated), receiver (current user), action: "accept" or "reject"
      const { requester, receiver, action } = req.body;
      if (!requester || !receiver || !action) {
        return res.status(400).json({ message: "Missing data" });
      }
      // Sort the two IDs.
      const sortedUsers = [requester, receiver].sort();

      const client = await clientPromise;
      const db = client.db();

      // Find the pending connection document for these two users.
      const connection = await db.collection("connections").findOne({
        users: sortedUsers,
        status: "pending",
      });

      if (!connection) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      if (action === "accept") {
        // Update status to accepted.
        await db
          .collection("connections")
          .updateOne({ _id: connection._id }, { $set: { status: "accepted" } });
        return res.status(200).json({ message: "Request accepted" });
      } else if (action === "reject") {
        // Option 1: update status to rejected.
        await db
          .collection("connections")
          .updateOne({ _id: connection._id }, { $set: { status: "rejected" } });
        // Option 2 (alternative): remove the document.
        // await db.collection("connections").deleteOne({ _id: connection._id });
        return res.status(200).json({ message: "Request rejected" });
      } else {
        return res.status(400).json({ message: "Invalid action" });
      }
    } catch (error) {
      console.error("Error responding to connection request:", error);
      return res
        .status(500)
        .json({ message: "Internal error", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}
