"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(`/api/users/${profileId}`);
      const data = await response.json();
      setProfile(data);
    };
    if (profileId) {
      fetchUserProfile();
    }
  }, [profileId]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `/api/users/${profileId || session?.user.id}/posts`
      );
      const data = await response.json();
      setPosts(data);
    };
    if (session?.user.id) {
      fetchPosts();
    }
  }, [profileId, session?.user.id]);

  const handleEdit = async (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this post?");
    if (hasConfirmed) {
      try {
        const res = await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        if (res.status === 200) {
          alert("Post deleted successfully");
          const filteredPosts = posts.filter((p) => p._id !== post._id);
          setPosts(filteredPosts);
        } else {
          alert(`Something went wrong with status code ${res.status}`);
        }
      } catch (error) {
        alert(`Something went wrong: ${error.message}`);
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name={
        !profileId || profileId === session?.user.id ? "My" : profile.username
      }
      desc={`Welcome to ${
        !profileId || profileId === session?.user.id
          ? "your personalizedyour personalized"
          : profile.username
      } profile page`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
