import Image from "next/image";
import Header from "../components/Header";
import { getSession } from "next-auth/react";
import Head from "next/head";

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  // Build the user object from session data (with fallbacks)
  const user = {
    name: session.user.name || "Your Name",
    email: session.user.email || "your.email@example.com",
    image: session.user.image || "/default-user.png",
  };

  // Dummy notifications array—replace with your own data or fetching logic
  const notifications = [
    {
      id: 1,
      content:
        "Suggested for you: If you're working on your resume tonight, consider using a professional layout.",
      timestamp: "1h ago",
      reactions: "1,327 reactions",
      comments: "107 comments",
    },
    {
      id: 2,
      content:
        "Rohan Krishna Das commented on Akaash Samson Gudlangar's post: 'Come on Boys. Cheer the Champions!'",
      timestamp: "4h ago",
    },
    {
      id: 3,
      content:
        "HARIHARAN GANESH posted: 'Embarking on the journey of Scylla University’s S101 course has been an incredible experience.'",
      timestamp: "6h ago",
    },
    {
      id: 4,
      content: "You appeared in 2 searches this week.",
      timestamp: "6h ago",
    },
    {
      id: 5,
      content:
        "Offline sales isn’t just about logistics, says Viraj Bahl. Here’s why.",
      timestamp: "7h ago",
    },
    {
      id: 6,
      content:
        "Frontend Developer Intern at Quartic.ai and 9 other recommendations for you. View jobs.",
      timestamp: "8h ago",
    },
    {
      id: 7,
      content:
        "The right mindset can help turn a promotion into an opportunity. Here’s how.",
      timestamp: "11h ago",
    },
  ];

  return {
    props: { user, notifications },
  };
}

export default function NotificationsPage({ user, notifications }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Head>
        <title>Notifications | LinkdIn</title>
        <link rel="icon" href="/logos/LinkdIn_Icon.png" />
      </Head>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar: Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-[#1D2226] p-6 rounded-md shadow">
              <div className="flex flex-col items-center">
                <Image
                  src={user.image}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Main Panel: Notifications */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-[#1D2226] p-6 rounded-md shadow">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Notifications
              </h2>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded"
                    >
                      <p className="text-gray-900 dark:text-white">
                        {notification.content}
                      </p>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span>{notification.timestamp}</span>
                        {notification.reactions && (
                          <span>{notification.reactions}</span>
                        )}
                        {notification.comments && (
                          <span>{notification.comments}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  No notifications found.
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar: Extra Options / Notification Settings */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-[#1D2226] p-6 rounded-md shadow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Notification Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage the notifications you receive and adjust your alert
                preferences.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => (window.location.href = "/settings")}
              >
                Manage Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
