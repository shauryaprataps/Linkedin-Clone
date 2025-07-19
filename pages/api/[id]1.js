// pages/api/users/[id].js

import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;
    // Include profile image along with other fields
    const {
      name,
      summary,
      pronouns,
      membership,
      title,
      location,
      skills,
      achievements,
      profileImage, // Profile picture field
    } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db();

      // Build the update object based on provided fields
      let updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (summary !== undefined) updateFields.summary = summary;
      if (pronouns !== undefined) updateFields.pronouns = pronouns;
      if (membership !== undefined) updateFields.membership = membership;
      if (title !== undefined) updateFields.title = title;
      if (location !== undefined) updateFields.location = location;
      if (skills !== undefined) updateFields.skills = skills; // Allow updating skills
      if (achievements !== undefined) updateFields.achievements = achievements; // Allow updating achievements
      if (profileImage !== undefined) updateFields.profileImage = profileImage; // Allow updating profile image

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
      }

      const result = await db
        .collection("users")
        .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: "User updated successfully" });
      } else {
        return res
          .status(404)
          .json({ message: "User not found or nothing updated" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
