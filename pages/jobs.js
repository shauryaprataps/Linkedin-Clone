import Image from "next/image";
import Header from "../components/Header";
import { getSession } from "next-auth/react";
import Head from "next/head";

// You might store a default image URL for users lacking one
const DEFAULT_USER_IMAGE = "/default-user.png";

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const user = {
    name: session.user.name || "Your Name",
    email: session.user.email || "your.email@example.com",
    image: session.user.image || DEFAULT_USER_IMAGE,
  };

  return {
    props: { user },
  };
}

export default function JobPage({ user }) {
  // Dummy job listings – replace or fetch as desired.
  const dummyJobs = [
    {
      id: "1",
      title: "Software Engineer Intern - Frontend",
      company: "Userology",
      location: "New York, NY",
      description:
        "Work on cutting edge technology to build scalable web apps and collaborate with a dynamic team.",
    },
    {
      id: "2",
      title: "Frontend Developer Intern",
      company: "Quartic.ai",
      location: "San Francisco, CA",
      description:
        "Join our team to develop user-friendly front-end applications using modern frameworks.",
    },
    {
      id: "3",
      title: "Front-End Developer Intern",
      company: "Unified Mentor Private Limited",
      location: "Remote",
      description:
        "Develop innovative solutions with a focus on responsive design and user experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Head>
        <title>Jobs | LinkdIn</title>
        <link rel="icon" href="/logos/LinkdIn_Icon.png" />
      </Head>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar: Profile Summary */}
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

          {/* Main Job Listings Section */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#1D2226] p-6 rounded-md shadow">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Top Job Picks
              </h2>
              <div className="space-y-4">
                {dummyJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {job.company} &mdash; {job.location}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {job.description}
                    </p>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* You may add additional sections here (e.g., job alerts, recommendations) */}
          </div>
        </div>
      </div>
    </div>
  );
}
