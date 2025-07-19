// components/Form.js
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { handlePostState, selectedMediaState } from "../atoms/postAtom";
import Image from "next/image";

function Form() {
  const [input, setInput] = useState("");
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);
  const [selectedMedia, setSelectedMedia] = useRecoilState(selectedMediaState);
  const fileInputRef = useRef(null);

  // Helper: Upload file to Cloudinary via our /api/upload endpoint
  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  }

  // Handle the post submission.
  const uploadPost = async (e) => {
    e.preventDefault();

    const payload = {
      input: input,
      username: session.user.name,
      email: session.user.email,
      userImg: session.user.image,
      createdAt: new Date().toISOString(),
    };

    if (selectedMedia) {
      const permanentUrl = await uploadFile(selectedMedia.file);
      if (selectedMedia.type.startsWith("image")) {
        payload.photoUrl = permanentUrl;
        payload.mediaType = "image";
      } else if (selectedMedia.type.startsWith("video")) {
        payload.videoUrl = permanentUrl;
        payload.mediaType = "video";
      } else {
        payload.photoUrl = permanentUrl;
        payload.mediaType = selectedMedia.type;
      }
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();
    console.log("Post response:", responseData);

    // Cleanup state after posting.
    setHandlePost(true);
    setModalOpen(false);
    setInput("");
    setSelectedMedia(null);
  };

  return (
    <form
      className="flex flex-col relative space-y-2 text-black/80 dark:text-white/75"
      onSubmit={uploadPost}
    >
      {/* Post Text Input */}
      <textarea
        rows="4"
        placeholder="What do you want to talk about?"
        className="bg-transparent focus:outline-none dark:placeholder-white/75"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Only show the custom file trigger if no file is selected */}
      {!selectedMedia && (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-1 rounded"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Add Media
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            console.log("Selected file:", file);
            setSelectedMedia({
              file,
              type: file.type,
              url: URL.createObjectURL(file),
            });
          }
        }}
        className="hidden"
      />

      {/* Preview of Selected Media */}
      {selectedMedia?.url && (
        <div className="relative w-full flex justify-center">
          {selectedMedia.type.startsWith("image") ? (
            <div className="relative w-full h-40">
              <Image
                src={selectedMedia.url}
                alt="Selected media"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          ) : (
            <video
              src={selectedMedia.url}
              controls
              className="max-w-full max-h-40 rounded-lg"
            />
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setSelectedMedia(null);
            }}
            className="absolute top-0 right-0 bg-gray-800 rounded-full p-1 text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Submit Post Button */}
      <button
        type="submit"
        className="absolute bottom-0 right-0 font-medium bg-blue-400 hover:bg-blue-500 disabled:text-black/40 disabled:bg-white/75 disabled:cursor-not-allowed text-white rounded-full px-3.5 py-1"
        disabled={!input.trim() && !selectedMedia?.url}
      >
        Post
      </button>
    </form>
  );
}

export default Form;
