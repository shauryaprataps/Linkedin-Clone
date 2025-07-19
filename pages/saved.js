import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Container, Typography } from "@mui/material";
import Post from "../components/Post";
import Header from "../components/Header";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const { data: session } = useSession();

  // Fetch saved posts when the session changes
  useEffect(() => {
    async function fetchSavedPosts() {
      if (!session || !session.user?.email) return;
      try {
        const res = await fetch(
          `/api/posts/saved?userEmail=${encodeURIComponent(session.user.email)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSavedPosts(data.savedPosts);
        } else {
          console.error("Failed to fetch saved posts");
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    }
    fetchSavedPosts();
  }, [session]);

  // Handler to unsave a post using the DELETE method
  const handleUnsave = async (postId) => {
    if (!session) return;
    try {
      const res = await fetch("/api/posts/save", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userEmail: session.user.email,
        }),
      });

      if (res.ok) {
        // Update UI by removing the unsaved post from the list.
        setSavedPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        const errorData = await res.json();
        console.error("Failed to unsave post:", errorData.error);
      }
    } catch (error) {
      console.error("Error unsaving the post:", error);
    }
  };

  if (!session) {
    return (
      <Container>
        <Typography variant="h6">
          Please sign in to view saved posts.
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Saved Posts
        </Typography>
        {savedPosts && savedPosts.length > 0 ? (
          savedPosts.map((post) => (
            <div key={post._id} style={{ marginBottom: "2rem" }}>
              {/* Pass unsaveHandler and isSaved prop to display the three dots menu accordingly */}
              <Post
                post={post}
                modalPost={false}
                isSaved={true}
                unsaveHandler={handleUnsave}
              />
            </div>
          ))
        ) : (
          <Typography variant="body1">No saved posts found.</Typography>
        )}
      </Container>
    </div>
  );
}
