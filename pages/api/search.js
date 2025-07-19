import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(200).json({ users: [] });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Use a case-insensitive regular expression for matching by name
    const regex = new RegExp(q, "i");

    const users = await db
      .collection("users")
      .find({ name: regex })
      .limit(10)
      .toArray();

    // Convert _id fields to strings for serialization
    const result = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }));

    res.status(200).json({ users: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
