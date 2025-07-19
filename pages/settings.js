import { useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState("Account Preferences"); // Default to Account Preferences
  const router = useRouter();
  const { section } = router.query;

  // Example options for the sidebar
  const menuOptions = [
    "Account Preferences",
    "Sign in & Security",
    "Visibility",
    "Data Privacy",
    "Advertising Data",
    "Notifications",
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Menu */}
          <aside className="w-full md:w-1/4 bg-white dark:bg-[#1D2226] rounded-md shadow p-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Settings
            </h2>
            <ul className="space-y-2">
              {menuOptions.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => setSelectedSection(option)}
                    className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                      selectedSection === option
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Settings Content */}
          <main className="w-full md:w-3/4 space-y-6">
            {selectedSection === "Account Preferences" && (
              <section className="bg-white dark:bg-[#1D2226] rounded-md shadow p-6 max-h-[75vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Account Preferences
                </h3>
                <ul className="space-y-6">
                  {/* Profile Information */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Profile Information
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Name, location, and industry
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Personal demographic information
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Verifications
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* General Preferences */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      General Preferences
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Language
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Content language
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Autoplay videos: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Sound effects: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Showing profile photos: <b>All LinkdIn members</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Preferred Feed View:{" "}
                          <b>Most relevant posts (Recommended)</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          People you unfollowed
                        </span>
                        <button className="text-blue-600 hover:underline">
                          View
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Syncing Options */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Syncing Options
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Sync calendar
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Sync Now
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Sync contacts
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Sync Now
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Subscriptions & Payments */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Subscriptions & Payments
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Reactivate
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          View purchase history
                        </span>
                        <button className="text-blue-600 hover:underline">
                          View
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Partners & Services */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Partners & Services
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Microsoft
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Account Management */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Account Management
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Hibernate account
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Close account
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
            )}

            {selectedSection === "Sign in & Security" && (
              <section className="bg-white dark:bg-[#1D2226] rounded-md shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Sign in & Security
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Email addresses
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Phone numbers
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Change password
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Passkeys
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Where you&apos;re signed in
                    </span>
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Devices that remember your password
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Two-step verification
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                </ul>
              </section>
            )}

            {/* Add more sections dynamically here for other settings */}
            {selectedSection === "Visibility" && (
              <section className="bg-white dark:bg-[#1D2226] rounded-md shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Visibility of Your Profile & Network
                </h3>
                <ul className="space-y-4">
                  {/* Profile Viewing Options */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Profile viewing options: <b>Private mode</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  {/* Page Visit Visibility */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Page visit visibility: <b>On</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </li>
                  {/* Public Profile Edit */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Edit your public profile
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </li>
                  {/* Email Visibility */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Who can see or download your email address
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  {/* Connections Visibility */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Who can see your connections: <b>On</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </li>
                  {/* Following Visibility */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Who can see members you follow: <b>Anyone on LinkdIn</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  {/* Last Name Visibility */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Who can see your last name
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </li>
                  {/* Organizations and Interests */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Representing your organizations and interests: <b>On</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  {/* Data Export Permissions */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Page owners exporting your data: <b>Off</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  {/* Profile Discovery Settings */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Profile discovery using email address: <b>Anyone</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Profile discovery using phone number: <b>Everyone</b>
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </li>
                  {/* Blocking Options */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Blocking
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                </ul>
              </section>
            )}
            {selectedSection === "Data Privacy" && (
              <section className="bg-white dark:bg-[#1D2226] rounded-md shadow p-6 max-h-[75vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Data Privacy
                </h3>
                <ul className="space-y-6">
                  {/* Section 1: How LinkdIn Uses Your Data */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      How LinkdIn uses your data
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Manage your data and activity
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Get a copy of your data
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Request
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Search history
                        </span>
                        <button className="text-blue-600 hover:underline">
                          View
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Personal demographic information
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Social, economic, and workplace research: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Data for Generative AI Improvement: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Section 2: Who Can Reach You */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Who can reach you
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Invitations to connect
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Invitations from your network
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Messages
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Research invites
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          LinkdIn promotions: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Section 3: Messaging Experience */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Messaging experience
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Focused Inbox: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Read receipts and typing indicators: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Messaging suggestions
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Message nudges: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Automated detection of harmful content: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Section 4: Job Seeking Preferences */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Job seeking preferences
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Job application settings
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Share your profile when you click Apply for a job:{" "}
                          <b>Off</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Signal your interest to recruiters: <b>Off</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Stored job applicant accounts
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Section 5: Other Applications */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Other applications
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Permitted services
                        </span>
                        <button className="text-blue-600 hover:underline">
                          View
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Microsoft Word: <b>On</b>
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
            )}
            {selectedSection === "Advertising Data" && (
              <section className="bg-white dark:bg-[#1D2226] rounded-md shadow p-6 max-h-[75vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Advertising Data Settings
                </h3>
                <ul className="space-y-6">
                  {/* Section 1: Profile Data */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Profile Data
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Connections
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Companies you follow
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Groups
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Education and Skills
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Job Information
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Section 2: Activity and Inferred Data */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Activity and Inferred Data
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Inferred city location
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Interests and traits
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Age range
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Gender
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Section 3: Third-Party Data */}
                  <li>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Third-Party Data
                    </h4>
                    <ul className="mt-2 space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Ads beyond LinkdIn
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Interactions with businesses
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Ad-related actions
                        </span>
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
            )}
            {selectedSection === "Notifications" && (
              <section className="bg-white dark:bg-[#1D2226] rounded-md shadow p-6 max-h-[75vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Notifications Settings
                </h3>
                <ul className="space-y-6">
                  {/* Notification Categories */}
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Searching for a job
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Hiring someone
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Connecting with others
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Network catch-up updates
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Posting and commenting
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Messaging
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Groups
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Pages
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Attending events
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      News and reports
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Updating your profile
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Verifications
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Games
                    </span>
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </li>
                </ul>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
