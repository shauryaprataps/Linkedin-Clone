// pages/mynetwork.js
import Header from "../components/Header";
import clientPromise from "../lib/mongodb";
import { useSession, getSession } from "next-auth/react";
import { ObjectId } from "mongodb";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";

export async function getServerSideProps({ req }) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    const client = await clientPromise;
    const db = client.db();
    const userId = session.user.id;

    // Fetch connection documents for this user (both accepted and pending)
    const connectionsData = await db
      .collection("connections")
      .find({
        users: userId,
        status: { $in: ["accepted", "pending"] },
      })
      .toArray();

    // Prepare arrays (store IDs as strings)
    const acceptedIds = [];
    const outgoingIds = [];
    const incomingIds = [];

    connectionsData.forEach((conn) => {
      const otherId = conn.users.find((u) => u !== userId);
      if (conn.status === "accepted") {
        acceptedIds.push(otherId);
      } else if (conn.status === "pending") {
        if (conn.requester === userId) {
          outgoingIds.push(otherId);
        } else {
          incomingIds.push(otherId);
        }
      }
    });

    // Fetch detailed user data for accepted connections.
    let acceptedUsers = [];
    if (acceptedIds.length > 0) {
      acceptedUsers = await db
        .collection("users")
        .find({ _id: { $in: acceptedIds.map((id) => new ObjectId(id)) } })
        .toArray();
      acceptedUsers = acceptedUsers.map((user) => ({
        id: user._id.toString(),
        name: user.name || "Unknown Name",
        title: user.title || "Unknown Title",
        image: user.image || "/default-user.png",
      }));
    }

    // Fetch detailed data for incoming pending requests.
    let incomingUsers = [];
    if (incomingIds.length > 0) {
      incomingUsers = await db
        .collection("users")
        .find({ _id: { $in: incomingIds.map((id) => new ObjectId(id)) } })
        .toArray();
      incomingUsers = incomingUsers.map((user) => ({
        id: user._id.toString(),
        name: user.name || "Unknown Name",
        title: user.title || "Unknown Title",
        image: user.image || "/default-user.png",
      }));
    }

    // Fetch all other users as potential connections.
    let allUsers = await db
      .collection("users")
      .find({ _id: { $ne: new ObjectId(userId) } })
      .toArray();
    allUsers = allUsers.map((user) => ({
      id: user._id.toString(),
      name: user.name || "Unknown Name",
      title: user.title || "Unknown Title",
      image: user.image || "/default-user.png",
    }));

    // Suggestions: users not already connected or in incoming requests.
    const excludeSet = new Set([...acceptedIds, ...incomingIds, userId]);
    const suggestions = allUsers.filter((user) => !excludeSet.has(user.id));

    // Also fetch outgoing requests.
    let outgoingUsers = [];
    if (outgoingIds.length > 0) {
      outgoingUsers = await db
        .collection("users")
        .find({ _id: { $in: outgoingIds.map((id) => new ObjectId(id)) } })
        .toArray();
      outgoingUsers = outgoingUsers.map((user) => ({
        id: user._id.toString(),
        name: user.name || "Unknown Name",
        title: user.title || "Unknown Title",
        image: user.image || "/default-user.png",
      }));
    }

    return {
      props: {
        acceptedUsers, // Your current accepted connections
        incomingUsers, // Connection requests coming in
        outgoingUsers, // Requests you have sent
        suggestions, // Other suggestions
      },
    };
  } catch (error) {
    console.error("Error fetching connections:", error);
    return {
      props: {
        acceptedUsers: [],
        incomingUsers: [],
        outgoingUsers: [],
        suggestions: [],
      },
    };
  }
}

export default function MyNetwork({
  acceptedUsers,
  incomingUsers,
  outgoingUsers,
  suggestions,
}) {
  const { data: session } = useSession();
  // Manage state for each section.
  const [accepted, setAccepted] = useState(acceptedUsers || []);
  const [incoming, setIncoming] = useState(incomingUsers || []);
  const [outgoing, setOutgoing] = useState(outgoingUsers || []);
  const [suggested, setSuggested] = useState(suggestions || []);

  // Return true if a suggestion is already pending as an outgoing request.
  const isOutgoing = (id) => outgoing.some((user) => user.id === id);

  // Handler for initiating a connection request.
  const handleConnect = async (personId) => {
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: session.user.id, receiver: personId }),
    });
    if (res.ok) {
      alert("Request sent!");
      const user = suggested.find((u) => u.id === personId);
      setOutgoing([...outgoing, user]);
      setSuggested(suggested.filter((u) => u.id !== personId));
    } else {
      alert("Error sending request.");
    }
  };

  // Handler for accepting an incoming request.
  const handleAccept = async (personId) => {
    const res = await fetch("/api/connections/respond", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requester: personId, // the one who sent the request
        receiver: session.user.id,
        action: "accept",
      }),
    });
    if (res.ok) {
      alert("Request accepted!");
      const user = incoming.find((u) => u.id === personId);
      setAccepted([...accepted, user]);
      setIncoming(incoming.filter((u) => u.id !== personId));
    } else {
      alert("Error accepting request.");
    }
  };

  // Handler for rejecting an incoming request.
  const handleReject = async (personId) => {
    const res = await fetch("/api/connections/respond", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requester: personId,
        receiver: session.user.id,
        action: "reject",
      }),
    });
    if (res.ok) {
      alert("Request rejected.");
      setIncoming(incoming.filter((u) => u.id !== personId));
    } else {
      alert("Error rejecting request.");
    }
  };

  // Handler for removing an accepted (connected) user.
  const handleRemoveConnection = async (personId) => {
    const confirmRemoval = window.confirm(
      "Are you sure you want to remove this user from your connections?"
    );
    if (!confirmRemoval) return;

    const res = await fetch("/api/connections/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user1: session.user.id, user2: personId }),
    });
    if (res.ok) {
      alert("Connection removed.");
      // Remove the user from accepted connections.
      const removedUser = accepted.find((u) => u.id === personId);
      setAccepted(accepted.filter((u) => u.id !== personId));
      // Optionally, add the user back to suggestions.
      setSuggested([...suggested, removedUser]);
    } else {
      alert("Error removing connection.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Head>
        <title>Grow | LinkdIn</title>
        <link rel="icon" href="/logos/LinkdIn_Icon.png" />
      </Head>
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          My Network
        </h1>

        {/* Your Connections Section */}
        <div className="bg-white dark:bg-[#1D2226] rounded-md shadow p-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Your Connections ({accepted.length})
          </h2>
          {accepted.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accepted.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center bg-gray-50 dark:bg-gray-800 rounded p-3"
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {person.title}
                    </p>
                  </div>
                  {/* The Connected element is now a clickable button */}
                  <button
                    onClick={() => handleRemoveConnection(person.id)}
                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    title="Remove Connection"
                  >
                    Connected
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              You haven&apos;t connected with anyone yet.
            </p>
          )}
        </div>

        {/* Incoming Connection Requests Section */}
        <div className="bg-white dark:bg-[#1D2226] rounded-md shadow p-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Incoming Connection Requests ({incoming.length})
          </h2>
          {incoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incoming.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center bg-gray-50 dark:bg-gray-800 rounded p-3"
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {person.title}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => handleAccept(person.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(person.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No incoming requests.
            </p>
          )}
        </div>

        {/* People You May Know Section */}
        <div className="bg-white dark:bg-[#1D2226] rounded-md shadow p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            People You May Know
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggested.length > 0 ? (
              suggested.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center bg-gray-50 dark:bg-gray-800 rounded p-3"
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {person.title}
                    </p>
                  </div>
                  {isOutgoing(person.id) ? (
                    <span className="ml-4 px-3 py-1 bg-gray-500 text-white rounded">
                      Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnect(person.id)}
                      className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No suggestions available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
