"use client";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import PromptCard from "./PromptCard";

const PromptCardsList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

function Feed() {
  const [searchedResults, setSearchedResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleTagClick = (postTag) => {
    setSearchText(postTag);
    debounceOnChange(postTag);
  };
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    debounceOnChange(e.target.value);
  };
  const debounceOnChange = debounce((searchValue) => {
    const matchedPosts = posts.filter((post) => {
      const regex = new RegExp(searchValue, "gi");
      return (
        post.prompt.match(regex) ||
        post.tag.match(regex) ||
        post.creator.username.match(regex)
      );
    });
    setSearchedResults(matchedPosts);
  }, 500);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          className="search_input peer"
          value={searchText}
          onChange={handleSearchChange}
          required
        />
      </form>
      {searchText ? (
        <PromptCardsList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardsList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
}

export default Feed;
