import React, { useRef } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@mui/material";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import ArticleIcon from "@mui/icons-material/Article";
import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import { selectedMediaState } from "../atoms/postAtom";

function Input() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const [selectedMedia, setSelectedMedia] = useRecoilState(selectedMediaState);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleMediaSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      // Store both the file object and its preview URL:
      setSelectedMedia({ file, url: fileURL, type });
      setModalType("dropIn");
      setModalOpen(true);
      event.target.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-[#1D2226] rounded-lg p-3 space-y-3 border border-gray-300 dark:border-none">
      <div className="flex items-center space-x-2">
        <Avatar
          src={session?.user?.image}
          className="!h-10 !w-10 cursor-pointer"
        />
        <button
          className="rounded-full border border-gray-400 py-2.5 px-3 opacity-80 hover:opacity-100 font-medium w-full text-left"
          onClick={() => {
            setModalType("dropIn");
            setModalOpen(true);
            setSelectedMedia(null); // Clear previous media
          }}
        >
          Start a post
        </button>
      </div>
      <div className="flex items-center flex-wrap gap-4 justify-center md:gap-x-10">
        <button
          className="inputButton group"
          onClick={() => imageInputRef.current.click()}
        >
          <PhotoSizeSelectActualIcon className="text-blue-500" />
          <h4 className="opacity-80 group-hover:opacity-100">Photo</h4>
        </button>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={imageInputRef}
          onChange={(e) => handleMediaSelect(e, "image")}
        />

        <button
          className="inputButton group"
          onClick={() => videoInputRef.current.click()}
        >
          <SmartDisplayIcon className="text-green-600" />
          <h4 className="opacity-80 group-hover:opacity-100">Video</h4>
        </button>
        <input
          type="file"
          accept="video/*"
          hidden
          ref={videoInputRef}
          onChange={(e) => handleMediaSelect(e, "video")}
        />

        <button
          className="inputButton group"
          onClick={() => {
            setModalType("dropIn");
            setModalOpen(true);
            setSelectedMedia(null);
          }}
        >
          <ArticleIcon className="text-red-500" />
          <h4 className="opacity-80 group-hover:opacity-100 whitespace-nowrap">
            Write Article
          </h4>
        </button>
      </div>
    </div>
  );
}

export default Input;
