import { useState } from "react";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import Image from "next/image";
import TimeAgo from "timeago-react";

function Widgets({ articles }) {
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  return (
    <div className="hidden xl:inline space-y-2 relative">
      {/* News */}
      <div className="bg-white dark:bg-[#1D2226] py-2.5 rounded-lg space-y-2 w-11/12 overflow-hidden border border-gray-300 dark:border-none relative">
        <div className="flex items-center justify-between font-bold px-2.5 relative">
          <h4>Trending Now</h4>
          <InfoRoundedIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => setShowInfoPopup(true)}
          />
          {showInfoPopup && (
            <div className="absolute z-10 top-8 right-0 w-72 bg-white dark:bg-[#1D2226] p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm">Trending News</h4>
                <button
                  onClick={() => setShowInfoPopup(false)}
                  className="text-gray-500 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">
                These are the day&apos;s top professional news stories and
                conversations. Learn more about how they&apos;re selected.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1">
          {articles.slice(0, 5).map((article) => (
            // Wrap each article in an anchor tag for clickability.
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex space-x-2 items-center cursor-pointer hover:bg-black/10 dark:hover:bg-black/20 px-2.5 py-1"
            >
              <FiberManualRecordRoundedIcon className="!h-2 !w-2" />
              <div>
                <h5 className="max-w-xs font-medium text-sm truncate pr-10">
                  {article.title}
                </h5>
                <TimeAgo
                  datetime={article.publishedAt}
                  className="text-xs mt-0.5 dark:text-white/75 opacity-80"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Ads */}
      <div className="bg-white dark:bg-[#1D2226] w-11/12 h-64 px-2.5 rounded-lg sticky top-20 border border-gray-300 dark:border-none">
        <div className="relative w-full h-full">
          <Image
            src="https://rb.gy/kbfeaa"
            alt="Advertisement"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Widgets;
