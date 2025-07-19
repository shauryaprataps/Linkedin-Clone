import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, body } = req;
  const { db } = await connectToDatabase();

  if (method === "PUT") {
    // Adding a comment
    const { postId, comment } = body;
    if (!postId || !comment || !comment.text) {
      return res.status(400).json({ error: "Missing or invalid parameters" });
    }

    // Assign a unique _id to the comment if not provided
    if (!comment._id) {
      comment._id = new ObjectId().toString(); // Convert to string
    }

    try {
      const result = await db.collection("posts").findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $push: { comments: { ...comment, _id: comment._id } } },
        { returnDocument: "after" } // Return the updated document
      );
      return res.status(200).json({ comments: result.value.comments });
    } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (method === "DELETE") {
    // Deleting a comment
    const { postId, commentId } = body;
    if (!postId || !commentId) {
      return res.status(400).json({ error: "Missing postId or commentId" });
    }

    try {
      // Check if commentId is a valid ObjectId
      let commentIdQuery;
      try {
        // Try to use it as an ObjectId
        commentIdQuery = new ObjectId(commentId);
      } catch (error) {
        // If not a valid ObjectId, use it as a string
        commentIdQuery = commentId;
      }

      // Try both ways - either with ObjectId or with string
      const updateResult = await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: {
            comments: {
              $or: [{ _id: commentIdQuery }, { _id: commentId.toString() }],
            },
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        // If first approach failed, try with direct string comparison
        await db
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(postId) },
            { $pull: { comments: { _id: commentId } } }
          );
      }

      const post = await db.collection("posts").findOne({
        _id: new ObjectId(postId),
      });

      return res.status(200).json({ comments: post.comments || [] });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
