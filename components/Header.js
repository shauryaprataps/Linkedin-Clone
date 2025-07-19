import Image from "next/image";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HeaderLink from "./HeaderLink";
import GroupIcon from "@mui/icons-material/Group";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import { Avatar } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

function Header() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Avatar dropdown
  // New state for "For Business" dropdown
  const [businessDropdownVisible, setBusinessDropdownVisible] = useState(false);

  // States for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { data: session } = useSession();
  const avatarDropdownRef = useRef(null);
  const businessDropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
      if (
        businessDropdownRef.current &&
        !businessDropdownRef.current.contains(event.target)
      ) {
        setBusinessDropdownVisible(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Optionally clear search suggestions here
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!session) {
      setDropdownVisible(false);
      setBusinessDropdownVisible(false);
    }
  }, [session]);

  // Debounce search query and fetch results
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.users || []);
          setSearchLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setSearchLoading(false);
        });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      {isInputFocused && (
        // Optional overlay when search input is active
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsInputFocused(false)}
        ></div>
      )}

      <header className="sticky top-0 z-40 bg-white dark:bg-[#1D2226] flex items-center justify-around py-0.5 px-5 focus-within:shadow-lg">
        {/* Left Side (Logo and Search) */}
        <div
          className="flex items-center space-x-2 w-full max-w-xs scale-90 relative"
          ref={searchRef}
        >
          {mounted && (
            <>
              {resolvedTheme === "dark" ? (
                <Image
                  src="https://rb.gy/bizvqj"
                  width={45}
                  height={45}
                  alt="Logo Dark"
                />
              ) : (
                <Image
                  src="data:image/png;base64,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"
                  width={55}
                  height={55}
                  alt="Logo Light"
                />
              )}
            </>
          )}
          {/* Search Container */}
          <div
            className={`flex items-center space-x-1 py-2.5 px-4 rounded w-full border transition-colors ${
              resolvedTheme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-200 border-gray-300 text-black"
            }`}
          >
            <SearchRoundedIcon className="text-inherit" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              className={`hidden md:inline-flex bg-transparent text-sm focus:outline-none flex-grow transition-colors ${
                resolvedTheme === "dark"
                  ? "placeholder-gray-300 text-white"
                  : "placeholder-gray-600 text-black"
              }`}
            />
          </div>
          {/* Search Suggestions Dropdown */}
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1D2226] shadow rounded mt-1 z-50">
              {searchLoading && (
                <div className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  Loading...
                </div>
              )}
              {searchResults.map((user) => (
                <Link href={`/profile/${user._id}`} key={user._id}>
                  <a
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <Image
                      src={user.image || "/default-user.png"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {user.title || ""}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Side (Other Header Links) */}
        <div className="flex items-center space-x-6 scale-95">
          <HeaderLink Icon={HomeRoundedIcon} text="Home" feed href="/" />
          <HeaderLink
            Icon={GroupIcon}
            text="My Network"
            feed
            href="/mynetwork"
          />
          <HeaderLink
            Icon={BusinessCenterIcon}
            text="Jobs"
            feed
            hidden
            href="/jobs"
          />
          <HeaderLink Icon={ChatIcon} text="Messaging" feed href="/messaging" />
          <HeaderLink
            Icon={NotificationsIcon}
            text="Notifications"
            feed
            href="/notifications"
          />

          {/* Avatar with Dropdown */}
          <div className="relative" ref={avatarDropdownRef}>
            <div
              onClick={() => setDropdownVisible((prev) => !prev)}
              className="cursor-pointer flex flex-col items-center"
            >
              <Avatar src={session?.user?.image} className="!h-7 !w-7" />
              <h4 className="text-sm hidden lg:flex justify-center w-full mt-1">
                Me &#11167;
              </h4>
            </div>
            {dropdownVisible && session && (
              <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-white dark:bg-[#1D2226] rounded-lg shadow-lg z-50">
                {session.user?.id ? (
                  <Link href={`/profile/${session.user.id}`}>
                    <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700">
                      View Profile
                    </a>
                  </Link>
                ) : (
                  <div className="block px-4 py-2 text-gray-800">
                    View Profile
                  </div>
                )}
                <Link href="/settings">
                  <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700">
                    Settings
                  </a>
                </Link>
                <button
                  onClick={() => {
                    setDropdownVisible(false);
                    signOut();
                  }}
                  className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Business Dropdown */}
          <div className="relative" ref={businessDropdownRef}>
            <div
              onClick={() => setBusinessDropdownVisible((prev) => !prev)}
              className="cursor-pointer flex flex-col items-center"
            >
              <AppsOutlinedIcon className="!h-7 !w-7" />
              <h4 className="text-sm hidden lg:flex justify-center w-full mt-1">
                For Business &#11167;
              </h4>
            </div>
            {businessDropdownVisible && (
              <div className="absolute top-full right-0 mt-2 w-80 py-4 bg-white dark:bg-[#1D2226] rounded-lg shadow-lg z-50">
                {/* My Apps section */}
                <div className="px-4 pb-2">
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                    My Apps
                  </h5>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Sell
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Groups
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Manage Billing
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Talent Insights
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Post a job
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Services Marketplace
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Advertise
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Learning
                    </li>
                  </ul>
                </div>
                <hr className="border-gray-300 dark:border-gray-700 my-2" />
                {/* Explore more for business section */}
                <div className="px-4">
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                    Explore more for business
                  </h5>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Hire on LinkdIn: Find, attract and recruit talent
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Sell with LinkdIn: Unlock sales opportunities
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Post a job for free: Get qualified applicants quickly
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Advertise on LinkdIn: Acquire customers and grow your
                      business
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Get started with Premium: Expand and leverage your network
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Learn with LinkdIn: Courses to develop your employees
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Admin Center: Manage billing and account details
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                      Create a Company Page
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {mounted && (
            <div
              className={`bg-gray-600 flex items-center px-0.5 rounded-full h-7 w-14 cursor-pointer flex-shrink-0 relative ${
                resolvedTheme === "dark" ? "justify-end" : "justify-start"
              }`}
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <span className="absolute left-0">
                <DarkModeIcon />
              </span>
              <motion.div
                className="w-6 h-6 bg-white rounded-full z-40"
                layout
                transition={spring}
              />
              <span className="absolute right-0.5">
                <LightModeIcon />
              </span>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
