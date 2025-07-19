// ./components/HeaderLink.js
import React from "react";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";

function HeaderLink({ Icon, text, avatar, feed, hidden, src, href = "" }) {
  const router = useRouter();

  // Check if the current route matches the link's href
  const isActive = router.pathname === href;

  return (
    <Link href={href} passHref>
      <a
        className={`cursor-pointer flex flex-col justify-center items-center ${
          feed
            ? "text-black/60 dark:text-white/75 hover:text-black dark:hover:text-white lg:-mb-1.5 space-y-1"
            : "text-gray-500 hover:text-gray-700"
        } ${isActive ? "text-black dark:text-white rounded-lg px-2 py-1" : ""}`}
      >
        {avatar ? (
          <Avatar src={src} className="!h-7 !w-7 lg:!-mb-1" />
        ) : (
          <Icon />
        )}
        <h4
          className={`text-sm ${
            feed && "hidden lg:flex justify-center w-full mx-auto"
          }`}
        >
          {text}
        </h4>
        {isActive && (
          <span className="hidden translate-y-1 lg:inline-flex h-0.5 w-[calc(100%+20px)] bg-black dark:bg-white rounded-t-full" />
        )}
      </a>
    </Link>
  );
}

export default HeaderLink;
