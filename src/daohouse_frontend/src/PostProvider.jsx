import React, { createContext, useState, useContext } from "react";

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

const PostProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <PostContext.Provider value={{ selectedPost, setSelectedPost }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
