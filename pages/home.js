import Image from "next/image";
import Head from "next/head";
import linkdin_full from "../public/logos/linkdin_full.svg";
import linkdin_home from "../public/linkdin_home.svg";
import HeaderLink from "../components/HeaderLink.js";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PeopleIcon from "@mui/icons-material/People";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ExtensionIcon from "@mui/icons-material/Extension";
import { getProviders, signIn } from "next-auth/react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Footer from "../components/Footer";
import { ThemeProvider } from "next-themes";

function Home({ providers }) {
  return (
    // Wrap the homepage content in a ThemeProvider that forces light mode
    <ThemeProvider forcedTheme="light" attribute="class">
      <div
        className="space-y-10 relative"
        style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}
      >
        <Head>
          <title>LinkdIn: Log In or Sign Up</title>
          <link rel="icon" href="/logos/LinkdIn_Icon.png" />
        </Head>

        {/* Header Section */}
        <header className="flex justify-around items-center py-4">
          {/* Logo */}
          <div className="w-36 h-10 relative">
            <Image
              src={linkdin_full}
              alt="LinkedIn Full Logo"
              width={144}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Navigation & Buttons */}
          <div className="flex items-center sm:divide-x divide-gray-300">
            <div className="hidden sm:flex space-x-8 pr-4">
              <HeaderLink Icon={NewspaperIcon} text="Articles" />
              <HeaderLink Icon={PeopleIcon} text="People" />
              <HeaderLink Icon={OndemandVideoIcon} text="Learning" />
              <HeaderLink Icon={BusinessCenterIcon} text="Jobs" />
              <HeaderLink Icon={ExtensionIcon} text="Games" />
            </div>

            <div className="space-x-4 px-2">
              <button
                className="font-semibold text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-full hover:text-gray-800"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Join now
              </button>

              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    key={provider.id}
                    className="text-blue-600 font-semibold rounded-full border border-blue-600 px-6 py-3 transition-all hover:text-blue-900 hover:bg-blue-50"
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  >
                    Sign in
                  </button>
                ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col xl:flex-row items-center max-w-screen-xl mx-auto gap-48 px-4 py-10">
          {/* Left Section */}
          <div className="space-y-8 xl:space-y-10 flex-1">
            <h1 className="text-gray-700 text-3xl md:text-5xl max-w-xl leading-snug pl-4 xl:pl-0">
              Welcome to your professional community
            </h1>
            <div className="space-y-4">
              <div
                className="cursor-pointer border border-gray-300 rounded-lg px-6 py-6 flex items-center justify-between hover:bg-gray-50transition-all"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <span className="text-xl font-semibold">Search for a job</span>
                <ArrowForwardIosRoundedIcon className="text-gray-700" />
              </div>
              <div
                className="cursor-pointer border border-gray-300 rounded-lg px-6 py-6 flex items-center justify-between hover:bg-gray-50 transition-all"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <span className="text-xl font-semibold">
                  Find a person you know
                </span>
                <ArrowForwardIosRoundedIcon className="text-gray-700" />
              </div>
              <div
                className="cursor-pointer border border-gray-300 rounded-lg px-6 py-6 flex items-center justify-between hover:bg-gray-50 transition-all"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <span className="text-xl font-semibold">Learn a new skill</span>
                <ArrowForwardIosRoundedIcon className="text-gray-700" />
              </div>
            </div>
          </div>

          {/* Right Section - Home Image */}
          <div className="relative w-80 h-80 xl:w-[600px] xl:h-[600px] flex-shrink-0">
            <Image
              src={linkdin_home}
              alt="LinkedIn Home Image"
              width={600}
              height={600}
              style={{ objectFit: "cover", borderRadius: "10px" }}
              priority
            />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default Home;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
