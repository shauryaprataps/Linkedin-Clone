import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import { useRecoilState } from "recoil";
import { handlePostState, getPostState } from "../atoms/postAtom";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import TimeAgo from "timeago-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Helper function: generate a temporary 24-character hexadecimal ID
function generateTempObjectId() {
  const hexChars = "0123456789abcdef";
  let objectId = "";
  for (let i = 0; i < 24; i++) {
    objectId += hexChars[Math.floor(Math.random() * 16)];
  }
  return objectId;
}

function Post({ post, modalPost, isSaved, unsaveHandler }) {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const [postState, setPostState] = useRecoilState(getPostState);
  const [showInput, setShowInput] = useState(false);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);

  // Local state for current post data (which includes likes and comments)
  const [currentPost, setCurrentPost] = useState(post);
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  // Liked state management
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (session?.user?.email && currentPost?.likes) {
      const isLiked = currentPost.likes.includes(session.user.email);
      setLiked(isLiked);
    } else {
      setLiked(false);
    }
  }, [currentPost, session]);

  // New state for showing the comment input box and the comment text
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState("");

  const truncate = (string, n) =>
    string?.length > n ? string.substr(0, n - 1) + "...see more" : string;

  const deletePost = async () => {
    await fetch(`/api/posts/${post._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    setHandlePost(true);
    setModalOpen(false);
  };

  // Toggle like functionality remains the same...
  const toggleLike = async () => {
    if (!session) return;

    const newLikeStatus = !liked;
    // Optimistic update:
    setLiked(newLikeStatus);
    const updatedLikes = [...(currentPost.likes || [])];
    if (newLikeStatus) {
      if (!updatedLikes.includes(session.user.email)) {
        updatedLikes.push(session.user.email);
      }
    } else {
      const index = updatedLikes.indexOf(session.user.email);
      if (index > -1) {
        updatedLikes.splice(index, 1);
      }
    }
    setCurrentPost((prev) => ({ ...prev, likes: updatedLikes }));
    try {
      const response = await fetch(`/api/posts/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          userEmail: session.user.email,
          like: newLikeStatus,
        }),
      });
      if (!response.ok) {
        setLiked((prev) => !prev);
        setCurrentPost(post);
      } else {
        const data = await response.json();
        setCurrentPost((prev) => ({ ...prev, likes: data.likes }));
        setHandlePost(true);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      setLiked((prev) => !prev);
      setCurrentPost(post);
    }
  };

  // Submit comment functionality with temporary _id generation
  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !session) return;

    // Create comment object with a temporary _id
    const newComment = {
      _id: generateTempObjectId(),
      text: commentText,
      username: session.user.name,
      userImg: session.user.image,
      email: session.user.email,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update: add new comment to currentPost.comments immediately
    setCurrentPost((prev) => ({
      ...prev,
      comments: prev.comments ? [newComment, ...prev.comments] : [newComment],
    }));

    try {
      const response = await fetch(`/api/posts/comment`, {
        method: "PUT", // Adding a comment via PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          comment: newComment,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update comments from server response (which should now include a proper _id if the DB assigns one)
        setCurrentPost((prev) => ({ ...prev, comments: data.comments }));
        setCommentText("");
      } else {
        console.error("Error posting comment:", await response.text());
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Delete comment functionality
  const deleteComment = async (commentId) => {
    if (!session) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/posts/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: currentPost._id,
          commentId: commentId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentPost((prev) => ({ ...prev, comments: data.comments }));
      } else {
        const errorText = await res.text();
        console.error("Failed to delete comment:", errorText);
        // Parse and log the error if it's JSON
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error details:", errorJson);
        } catch (e) {
          // If it's not JSON, the error is already logged above
        }
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // --- Dropdown Menu State and Handlers ---
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handler for the unsave action
  const handleUnsaveClick = () => {
    if (unsaveHandler) {
      unsaveHandler(post._id);
    }
    handleMenuClose();
  };

  const handleSavePost = async () => {
    // Check if user is logged in
    if (!session?.user?.email) {
      console.error("User not authenticated.");
      return;
    }

    try {
      const res = await fetch("/api/posts/save", {
        method: "PUT", // Using PUT for save based on your API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id, // Ensure this is a string and matches how it's stored.
          userEmail: session.user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Post saved successfully:", data.message);
        // Optionally update local UI state to reflect the saved status.
      } else {
        console.error("Error saving post:", data.error);
      }
    } catch (error) {
      console.error("Error calling save post API:", error);
    } finally {
      // Close the menu regardless of success or failure
      handleMenuClose();
    }
  };

  const handleReportPost = () => {
    // Implement your report functionality here
    console.log("Post reported");
    handleMenuClose();
  };
  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file); // Using key: "file"
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  }

  return (
    <div
      className={`bg-white dark:bg-[#1D2226] ${
        modalPost ? "rounded-r-lg" : "rounded-lg"
      } space-y-2 py-2.5 border border-gray-300 dark:border-none`}
    >
      {/* Post Header */}
      <div className="flex items-center px-2.5 cursor-pointer">
        <Avatar
          src={currentPost.userImg}
          className="!h-10 !w-10 cursor-pointer"
        />
        <div className="mr-auto ml-2 leading-none">
          <h6 className="font-medium hover:text-blue-500 hover:underline">
            {currentPost.username}
          </h6>
          <p className="text-sm dark:text-white/75 opacity-80">
            {currentPost.email}
          </p>
          <TimeAgo
            datetime={currentPost.createdAt}
            className="text-xs dark:text-white/75 opacity-80"
          />
        </div>
        {modalPost ? (
          <IconButton onClick={() => setModalOpen(false)}>
            <CloseRoundedIcon className="dark:text-white/75 h-7 w-7" />
          </IconButton>
        ) : (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreHorizRoundedIcon className="dark:text-white/75 h-7 w-7" />
            </IconButton>
            <Menu
              anchorEl={menuOpen ? menuOpen.anchor : null}
              open={Boolean(menuOpen)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {/* Conditionally display "Unsave Post" if isSaved is true, otherwise "Save Post" */}
              <MenuItem onClick={isSaved ? handleUnsaveClick : handleSavePost}>
                {isSaved ? "Unsave Post" : "Save Post"}
              </MenuItem>
              <MenuItem onClick={handleReportPost}>Report Post</MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* Post Content */}
      {currentPost.input && (
        <div className="px-2.5 break-all md:break-normal">
          {modalPost || showInput ? (
            <p onClick={() => setShowInput(false)}>{currentPost.input}</p>
          ) : (
            <p onClick={() => setShowInput(true)}>
              {truncate(currentPost.input, 150)}
            </p>
          )}
        </div>
      )}

      {/* Media Section */}
      {currentPost.videoUrl ? (
        <video
          className="w-full h-auto cursor-pointer"
          controls
          onClick={() => {
            setModalOpen(true);
            setModalType("gifYouUp");
            setPostState(currentPost);
          }}
        >
          <source src={currentPost.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : currentPost.photoUrl ? (
        // Wrap the Image in a relative container with fixed height
        <div
          className="relative w-full h-64 cursor-pointer"
          onClick={() => {
            setModalOpen(true);
            setModalType("gifYouUp");
            setPostState(currentPost);
          }}
        >
          <Image
            src={currentPost.photoUrl}
            alt="Post Image"
            layout="fill"
            objectFit="cover"
            className="rounded"
            unoptimized // remove this once you've confirmed it works
          />
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex justify-evenly items-center dark:border-t border-gray-600/80 mx-2.5 pt-2 text-black/60 dark:text-white/75">
        <button
          className={`postButton ${liked && "text-blue-500"}`}
          onClick={toggleLike}
        >
          {liked ? (
            <ThumbUpOffAltRoundedIcon className="-scale-x-100" />
          ) : (
            <ThumbUpOffAltOutlinedIcon className="-scale-x-100" />
          )}
          <h4>Like</h4>
        </button>
        <button
          className="postButton"
          onClick={() => setShowComment((prev) => !prev)}
        >
          <CommentOutlinedIcon />
          <h4>Comment</h4>
        </button>
        {session?.user?.email === currentPost.email ? (
          <button
            className="postButton focus:text-red-400"
            onClick={deletePost}
          >
            <DeleteRoundedIcon />
            <h4>Delete post</h4>
          </button>
        ) : (
          <button className="postButton">
            <ReplyRoundedIcon className="-scale-x-100" />
            <h4>Share</h4>
          </button>
        )}
      </div>

      {/* Comment Section */}
      {showComment && (
        <div className="px-2.5 pt-2">
          <form
            onSubmit={submitComment}
            className="flex items-center space-x-2 mb-2"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow border p-2 rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-400 text-white px-3 py-1 rounded-lg"
            >
              Post
            </button>
          </form>
          <div className="space-y-2">
            {currentPost.comments &&
              currentPost.comments.map((comm) => (
                <div
                  key={comm._id || comm.text}
                  className="flex items-start space-x-2"
                >
                  <Avatar src={comm.userImg} className="!h-8 !w-8" />
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{comm.username}</p>
                      {session?.user?.email === comm.email && (
                        <button
                          className="text-xs text-red-500"
                          onClick={async () => {
                            await deleteComment(comm._id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-sm">{comm.text}</p>
                    <TimeAgo
                      datetime={comm.createdAt}
                      className="text-xs text-gray-500"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to truncate text
function truncate(text, length) {
  if (!text) return "";
  return text.length > length ? text.substr(0, length) + "..." : text;
}

export default Post;
