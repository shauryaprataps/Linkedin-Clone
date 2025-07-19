import { getSession, useSession } from "next-auth/react";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import Header from "../../components/Header";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

// --------------------------------------------------------------------
// getServerSideProps: Fetch user data, connections count, skills & achievements
// --------------------------------------------------------------------
export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({
    _id: new ObjectId(params.id),
  });

  if (!user) {
    return { notFound: true };
  }

  user._id = user._id.toString();
  user.image = user.image || "/default-user.png";
  user.name = user.name || "Add a Name";
  user.pronouns = user.pronouns || "Add your pronouns";
  user.membership = user.membership || "Add a role";
  user.title = user.title || "Add a title";
  user.location = user.location || "Add a location";
  user.summary =
    user.summary ||
    "Add your summary here to let people know about you! This may include your passions, professional highlights, and personality traits.";

  // Get the connections count from the database (or fallback dummy)
  const connectionsCount = await db.collection("connections").countDocuments({
    users: user._id, // Make sure user._id is stored as a string in the connection documents.
    status: "accepted",
  });

  // Retrieve skills and achievements or use fallback dummy data
  const skills = user.skills || [];
  const achievements = user.achievements || [];

  return { props: { user, connectionsCount, skills, achievements } };
}

// --------------------------------------------------------------------
// Helper: format achievements to editable text
// --------------------------------------------------------------------
function formatAchievementsToText(achievementsArray) {
  return achievementsArray
    .map(
      (ach) =>
        `${ach.title} | ${ach.issuer} | ${formattedDate} | ${ach.description}`
    )
    .join("\n");
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --------------------------------------------------------------------
// ProfilePage Component
// --------------------------------------------------------------------
export default function ProfilePage({
  user,
  connectionsCount,
  skills,
  achievements,
}) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === user._id;

  const initialAchievements = (achievements || []).map((ach) => ({
    ...ach,
    month: ach.month !== undefined ? ach.month : new Date().getMonth(), // 0-indexed month
    year: ach.year !== undefined ? ach.year : new Date().getFullYear(),
  }));

  // Existing editable state for basic profile fields
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [updatingName, setUpdatingName] = useState(false);

  const [editingAbout, setEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState(user.summary);
  const [updatingAbout, setUpdatingAbout] = useState(false);

  const [editingPronouns, setEditingPronouns] = useState(false);
  const [editedPronouns, setEditedPronouns] = useState(user.pronouns);
  const [updatingPronouns, setUpdatingPronouns] = useState(false);

  const [editingMembership, setEditingMembership] = useState(false);
  const [editedMembership, setEditedMembership] = useState(user.membership);
  const [updatingMembership, setUpdatingMembership] = useState(false);

  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(user.title);
  const [updatingTitle, setUpdatingTitle] = useState(false);

  const [editingLocation, setEditingLocation] = useState(false);
  const [editedLocation, setEditedLocation] = useState(user.location);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const [editingSkills, setEditingSkills] = useState(false);
  const [editedSkills, setEditedSkills] = useState(skills);
  const [newSkill, setNewSkill] = useState("");
  const [updatingSkills, setUpdatingSkills] = useState(false);

  // New state for Achievements editing (multiline text)
  const [editingAchievements, setEditingAchievements] = useState(false);
  const [editedAchievements, setEditedAchievements] =
    useState(initialAchievements);
  const [updatingAchievements, setUpdatingAchievements] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = January
  const [selectedYear, setSelectedYear] = useState("2024"); // default year
  // --------------------------------------------------------------------
  // Update Handlers for each field
  // --------------------------------------------------------------------
  const handleSaveName = async () => {
    setUpdatingName(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingName(false);
      } else {
        alert(data.message || "Unable to update name");
      }
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Error updating name");
    } finally {
      setUpdatingName(false);
    }
  };

  const handleSaveAbout = async () => {
    setUpdatingAbout(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: editedAbout }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingAbout(false);
      } else {
        alert(data.message || "Unable to update about");
      }
    } catch (error) {
      console.error("Error updating about:", error);
      alert("Error updating about");
    } finally {
      setUpdatingAbout(false);
    }
  };

  const handleSavePronouns = async () => {
    setUpdatingPronouns(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pronouns: editedPronouns }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingPronouns(false);
      } else {
        alert(data.message || "Unable to update pronouns");
      }
    } catch (error) {
      console.error("Error updating pronouns:", error);
      alert("Error updating pronouns");
    } finally {
      setUpdatingPronouns(false);
    }
  };

  const handleSaveMembership = async () => {
    setUpdatingMembership(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membership: editedMembership }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingMembership(false);
      } else {
        alert(data.message || "Unable to update membership");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Error updating membership");
    } finally {
      setUpdatingMembership(false);
    }
  };

  const handleSaveTitle = async () => {
    setUpdatingTitle(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingTitle(false);
      } else {
        alert(data.message || "Unable to update title");
      }
    } catch (error) {
      console.error("Error updating title:", error);
      alert("Error updating title");
    } finally {
      setUpdatingTitle(false);
    }
  };

  const handleSaveLocation = async () => {
    setUpdatingLocation(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: editedLocation }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingLocation(false);
      } else {
        alert(data.message || "Unable to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Error updating location");
    } finally {
      setUpdatingLocation(false);
    }
  };

  const handleMonthChange = (e, index) => {
    const newMonth = parseInt(e.target.value);
    setEditedAchievements((prevAchievements) =>
      prevAchievements.map((ach, i) =>
        i === index ? { ...ach, month: newMonth } : ach
      )
    );
  };

  const handleYearChange = (e, index) => {
    const newYear = e.target.value;
    setEditedAchievements((prevAchievements) =>
      prevAchievements.map((ach, i) =>
        i === index ? { ...ach, year: newYear } : ach
      )
    );
  };

  // New handlers for Skills and Achievements

  // Handler for adding a new skill
  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !editedSkills.includes(trimmedSkill)) {
      setEditedSkills([...editedSkills, trimmedSkill]);
      setNewSkill("");
    }
  };

  // Handler for removing a skill by index
  const handleRemoveSkill = (index) => {
    const updated = [...editedSkills];
    updated.splice(index, 1);
    setEditedSkills(updated);
  };
  const handleSaveSkills = async () => {
    setUpdatingSkills(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: editedSkills }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingSkills(false);
      } else {
        alert(data.message || "Unable to update skills");
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      alert("Error updating skills");
    } finally {
      setUpdatingSkills(false);
    }
  };

  const handleSaveAchievements = async () => {
    setUpdatingAchievements(true);
    try {
      // Filter out achievements with an empty title.
      const achievementsToSave = editedAchievements.filter(
        (ach) => ach.title.trim() !== ""
      );
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievements: achievementsToSave }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingAchievements(false);
        // Optionally, update the achievements state from the new result.
      } else {
        alert(data.message || "Unable to update achievements");
      }
    } catch (error) {
      console.error("Error updating achievements:", error);
      alert("Error updating achievements");
    } finally {
      setUpdatingAchievements(false);
    }
  };

  const formattedDate = `${monthNames[selectedMonth]} ${selectedYear}`;

  const [profileImage, setProfileImage] = useState(user.image); // Initial profile image
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading indicator during upload

  // Function to update the profile image URL in the database
  const updateUserProfile = async (imageUrl) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      if (response.ok) {
        console.log("Profile updated successfully!");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Function to handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    // Validate file size and type
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image.");
      return;
    }

    setLoading(true); // Show loading indicator
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload the file to Cloudinary
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok) {
        const newImageUrl = uploadData.url; // Get the uploaded image URL from Cloudinary
        setProfileImage(newImageUrl); // Update the profile image locally
        await updateUserProfile(newImageUrl); // Update the database with the new image URL
        setIsEditing(false); // Exit edit mode
      } else {
        alert("Failed to upload the image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // --------------------------------------------------------------------
  // Render Profile Page – Using existing styling/placement
  // --------------------------------------------------------------------
  return (
    <div className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>{user.name} | LinkdIn</title>
        <link rel="icon" href="/logos/LinkdIn_Icon.png" />
      </Head>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative">
          {/* Header Background */}
          <div
            className="w-full h-60 bg-cover bg-center"
            style={{
              backgroundImage: "url('')",
            }}
          ></div>
          {/* Profile Image */}
          <div
            className="absolute left-8 bottom-0 transform translate-y-1/2 cursor-pointer"
            onClick={() => setIsEditing(true)} // Enable editing when clicking the profile image
          >
            <Image
              src={profileImage}
              alt={user.name}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <span className="text-white">Uploading...</span>
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <label
                  htmlFor="profileImageUpload"
                  className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                >
                  Upload
                </label>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload} // Trigger the upload process
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="mt-20 px-8">
          <div className="bg-white dark:bg-[#1D2226] p-6 rounded-md shadow">
            {isOwnProfile ? (
              <div className="flex items-center space-x-2">
                {!editingName ? (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {editedName}
                    </h1>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Edit Name"
                    >
                      <EditIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-3xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-1 rounded"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={updatingName}
                      className="ml-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {updatingName ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setEditedName(user.name);
                      }}
                      className="ml-2 px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
            )}

            {/* Display connection count */}
            {isOwnProfile ? (
              // If it's the signed-in user's profile, render the clickable link
              <Link href="/mynetwork" passHref>
                <a className="mt-1 text-blue-600 hover:underline">
                  Connections: {connectionsCount}
                </a>
              </Link>
            ) : (
              // If it's another user's profile, render plain text without link
              <span className="mt-1 text-gray-500">
                Connections: {connectionsCount}
              </span>
            )}

            {isOwnProfile ? (
              <div className="mt-1 flex items-center space-x-2">
                {!editingPronouns ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {editedPronouns}
                    </p>
                    <button
                      onClick={() => setEditingPronouns(true)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Edit Pronouns"
                    >
                      <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editedPronouns}
                      onChange={(e) => setEditedPronouns(e.target.value)}
                      className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-1 rounded"
                      placeholder="Add pronouns"
                    />
                    <button
                      onClick={handleSavePronouns}
                      disabled={updatingPronouns}
                      className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      {updatingPronouns ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPronouns(false);
                        setEditedPronouns(user.pronouns);
                      }}
                      className="ml-2 px-2 py-1 bg-gray-300 text-black text-xs rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {user.pronouns}
              </p>
            )}

            {/* Membership */}
            {isOwnProfile ? (
              <div className="mt-2 flex items-center space-x-2">
                {!editingMembership ? (
                  <>
                    <p className="text-blue-600">{editedMembership}</p>
                    <button
                      onClick={() => setEditingMembership(true)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Edit Membership"
                    >
                      <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editedMembership}
                      onChange={(e) => setEditedMembership(e.target.value)}
                      className="text-blue-600 bg-gray-100 dark:bg-gray-800 p-1 rounded"
                    />
                    <button
                      onClick={handleSaveMembership}
                      disabled={updatingMembership}
                      className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      {updatingMembership ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingMembership(false);
                        setEditedMembership(user.membership);
                      }}
                      className="ml-2 px-2 py-1 bg-gray-300 text-black text-xs rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-blue-600">{user.membership}</p>
            )}

            {/* Title */}
            {isOwnProfile ? (
              <div className="mt-1 flex items-center space-x-2">
                {!editingTitle ? (
                  <>
                    <p className="text-gray-700 dark:text-gray-200">
                      {editedTitle}
                    </p>
                    <button
                      onClick={() => setEditingTitle(true)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Edit Title"
                    >
                      <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-1 rounded"
                    />
                    <button
                      onClick={handleSaveTitle}
                      disabled={updatingTitle}
                      className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      {updatingTitle ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingTitle(false);
                        setEditedTitle(user.title);
                      }}
                      className="ml-2 px-2 py-1 bg-gray-300 text-black text-xs rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-1 text-gray-700 dark:text-gray-200">
                {user.title}
              </p>
            )}

            {/* Location */}
            <div className="mt-2 flex items-center text-gray-600 dark:text-gray-300">
              <svg
                className="w-4 h-4 mr-1 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
              {isOwnProfile ? (
                <>
                  {!editingLocation ? (
                    <>
                      <p>{editedLocation}</p>
                      <button
                        onClick={() => setEditingLocation(true)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Edit Location"
                      >
                        <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedLocation}
                        onChange={(e) => setEditedLocation(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-800 p-1 rounded"
                      />
                      <button
                        onClick={handleSaveLocation}
                        disabled={updatingLocation}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        {updatingLocation ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingLocation(false);
                          setEditedLocation(user.location);
                        }}
                        className="ml-2 px-2 py-1 bg-gray-300 text-black text-xs rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>{user.location}</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1D2226] p-6 mt-6 rounded-md shadow">
            {isOwnProfile ? (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    About
                  </h2>
                  {!editingAbout && (
                    <button
                      onClick={() => setEditingAbout(true)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Edit About"
                    >
                      <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}
                </div>
                {!editingAbout ? (
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {editedAbout}
                  </p>
                ) : (
                  <div className="flex flex-col">
                    <textarea
                      value={editedAbout}
                      onChange={(e) => setEditedAbout(e.target.value)}
                      className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                      rows={4}
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={handleSaveAbout}
                        disabled={updatingAbout}
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {updatingAbout ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingAbout(false);
                          setEditedAbout(user.summary);
                        }}
                        className="px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  About
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {user.summary}
                </p>
              </div>
            )}
          </div>

          {/* Editable Achievements and Skills Section */}
          <div className="mt-8">
            {/* Skills Section */}
            <div className="bg-white dark:bg-[#1D2226] p-6 rounded-md shadow mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Skills
                </h2>
                {isOwnProfile && (
                  <button
                    onClick={() => setEditingSkills(!editingSkills)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Edit Skills"
                  >
                    <EditIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>
              {editingSkills ? (
                <div className="flex flex-col space-y-4">
                  {/* Display the skills as individual chips */}
                  <div className="flex flex-wrap gap-2">
                    {editedSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded flex items-center"
                      >
                        <span className="text-gray-800 dark:text-white">
                          {skill}
                        </span>
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Input field to add a new skill */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="px-3 py-2 border rounded flex-grow bg-gray-50 dark:bg-gray-800"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  {/* Save and Cancel buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveSkills}
                      disabled={updatingSkills}
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {updatingSkills ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingSkills(false);
                        setEditedSkills(skills); // Reset to original skills from props
                        setNewSkill("");
                      }}
                      className="px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {skills.length > 0 ? (
                    <ul className="space-y-2">
                      {skills.map((skill, index) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300 border-b pb-1"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      You haven&apos;t added any skills yet. Click Edit to add
                      your skills.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Achievements Section */}
            <div className="bg-white dark:bg-[#1D2226] p-6 rounded-md shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Achievements
                </h2>
                {isOwnProfile && (
                  <button
                    onClick={() => setEditingAchievements(!editingAchievements)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Edit Achievements"
                  >
                    <EditIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>
              {editingAchievements ? (
                <div className="flex flex-col space-y-4">
                  {/* Render each achievement as its own card */}
                  {editedAchievements.map((ach, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => {
                            const newAch = [...editedAchievements];
                            newAch[index].title = e.target.value;
                            setEditedAchievements(newAch);
                          }}
                          placeholder="Title"
                          className="w-full p-2 border rounded dark:bg-gray-700"
                        />
                        <button
                          onClick={() => {
                            const newAchievements = editedAchievements.filter(
                              (_, i) => i !== index
                            );
                            setEditedAchievements(newAchievements);
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Delete Achievement"
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="text"
                        value={ach.issuer}
                        onChange={(e) => {
                          const newAch = [...editedAchievements];
                          newAch[index].issuer = e.target.value;
                          setEditedAchievements(newAch);
                        }}
                        placeholder="Issuer"
                        className="w-full p-2 border rounded dark:bg-gray-700 mt-2"
                      />
                      <div className="flex space-x-2 mt-2">
                        <p className="my-2">Issue Date -</p>
                        <select
                          className="p-2 border rounded dark:bg-gray-700"
                          value={ach.month}
                          onChange={(e) => handleMonthChange(e, index)}
                        >
                          {monthNames.map((month, idx) => (
                            <option key={idx} value={idx}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          className="p-2 border rounded dark:bg-gray-700"
                          value={ach.year}
                          onChange={(e) => handleYearChange(e, index)}
                        >
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() - 5 + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="mt-2">
                        Selected Date: {`${monthNames[ach.month]} ${ach.year}`}
                      </div>
                      <textarea
                        value={ach.description}
                        onChange={(e) => {
                          const newAch = [...editedAchievements];
                          newAch[index].description = e.target.value;
                          setEditedAchievements(newAch);
                        }}
                        placeholder="Description"
                        className="w-full p-2 border rounded dark:bg-gray-700 mt-2"
                        rows="3"
                      />
                    </div>
                  ))}

                  {/* Button to add a new achievement only if current last one is not blank */}
                  <button
                    onClick={() => {
                      // Prevent adding a new blank achievement if the last one is still blank
                      if (
                        editedAchievements.length === 0 ||
                        editedAchievements[
                          editedAchievements.length - 1
                        ].title.trim() !== ""
                      ) {
                        setEditedAchievements([
                          ...editedAchievements,
                          { title: "", issuer: "", date: "", description: "" },
                        ]);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add New Achievement
                  </button>

                  {/* Save and Cancel buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveAchievements}
                      disabled={updatingAchievements}
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {updatingAchievements ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingAchievements(false);
                        // Reset to original achievements
                        setEditedAchievements(achievements);
                      }}
                      className="px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {achievements.length > 0 ? (
                    <ul className="space-y-4">
                      {achievements.map((ach, index) => (
                        <li key={index} className="border-b pb-2">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            {ach.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {ach.issuer} - {formattedDate}
                          </p>
                          <p className="text-gray-700 dark:text-gray-200">
                            {ach.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      You haven&apos;t added any achievements yet. Click Edit to
                      add one.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          {/* End of Achievements and Skills Section */}
        </div>
      </div>
    </div>
  );
}
