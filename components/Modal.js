import { useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";
import { useSession } from "next-auth/react";
import { Avatar } from "@mui/material";
import Form from "./Form";
import { useRecoilValue, useRecoilState } from "recoil";
import { getPostState, selectedMediaState } from "../atoms/postAtom";
import Post from "./Post";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import Image from "next/image";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const gifYouUp = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

const Modal = ({ handleClose, type }) => {
  const { data: session } = useSession();
  const post = useRecoilValue(getPostState);
  const [selectedMedia, setSelectedMedia] = useRecoilState(selectedMediaState);

  // Create refs for hidden image and video inputs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // General handler to set selected media from either input
  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedMedia(e.target.files[0]);
    }
  };

  // Functions to trigger clicks on the hidden file inputs
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  // Compute the URL only if selectedMedia is a valid Blob (like a File)
  const mediaUrl = useMemo(() => {
    if (selectedMedia && selectedMedia instanceof Blob) {
      return URL.createObjectURL(selectedMedia);
    }
    return null;
  }, [selectedMedia]);

  // Cleanup the object URL when the component unmounts or selectedMedia changes
  useEffect(() => {
    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, [mediaUrl]);

  return (
    <Backdrop onClick={handleClose}>
      {type === "dropIn" && (
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="rounded-xl flex flex-col justify-center bg-white dark:bg-[#1D2226] w-full max-w-lg md:-mt-96 mx-6"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/75 px-4 py-2.5">
            <h4 className="text-xl">Create a post</h4>
            <IconButton onClick={handleClose}>
              <CloseRoundedIcon className="h-7 w-7 dark:text-white/75" />
            </IconButton>
          </div>

          <div className="p-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <Avatar src={session?.user?.image} className="!h-11 !w-11" />
              <h6>{session?.user?.name}</h6>
            </div>

            {/* Writing part */}
            <Form />

            {/* Media upload icons placed below the writing area */}
            <div className="flex  mt-4 space-x-4">
              <IconButton size="small" onClick={handleImageClick}>
                <PhotoSizeSelectActualIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleVideoClick}>
                <SmartDisplayIcon fontSize="small" />
              </IconButton>
            </div>

            {/* Hidden Inputs */}
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleMediaChange}
              className="hidden"
            />
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleMediaChange}
              className="hidden"
            />

            {/* Media Preview */}
            {selectedMedia && mediaUrl && (
              <div className="mt-4">
                {selectedMedia.type.startsWith("image") ? (
                  <Image
                    src={mediaUrl}
                    alt="Media Preview"
                    className="w-full h-auto object-contain rounded"
                  />
                ) : (
                  <video className="w-full h-auto" controls>
                    <source src={mediaUrl} type={selectedMedia.type} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {type === "gifYouUp" && (
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="rounded-l-lg flex bg-[#1D2226] w-full max-w-6xl -mt-[7vh] mx-6"
          variants={gifYouUp}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {post.videoUrl ? (
            <video
              className="object-contain max-h-[80vh] w-full max-w-3xl rounded-l-lg"
              controls
              onDoubleClick={handleClose}
            >
              <source src={post.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <motion.img
              alt=""
              onDoubleClick={handleClose}
              src={post.photoUrl}
              className="object-contain max-h-[80vh] w-full max-w-3xl rounded-l-lg"
            />
          )}
          <div className="w-full md:w-3/5 bg-white dark:bg-[#1D2226] rounded-r-lg">
            <Post post={post} modalPost />
          </div>
        </motion.div>
      )}
    </Backdrop>
  );
};

export default Modal;
