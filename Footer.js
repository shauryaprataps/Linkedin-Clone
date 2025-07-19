// components/Footer.js
import React from "react";

function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-white dark:bg-[#1D2226] border-t border-gray-300 dark:border-gray-700 py-2">
      <div className="max-w-screen-lg mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
        <span>©2025 LinkdIn</span>
        <span>About</span>
        <span>Accessibility</span>
        <span>User Agreement</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span>Copyright Policy</span>
        <span>Brand Policy</span>
        <span>Community Guidelines</span>
      </div>
    </footer>
  );
}

export default Footer;
