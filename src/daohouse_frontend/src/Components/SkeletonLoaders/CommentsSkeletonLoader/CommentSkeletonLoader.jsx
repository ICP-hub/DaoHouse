// Components/SkeletonLoaders/CommentsSkeletonLoader/CommentSkeletonLoader.jsx
import React from 'react';

const CommentSkeletonLoader = () => {
  return (
    <div className="flex animate-pulse font-mulish">
      <div className="p-4 rounded-lg w-full gap-[18px]">
        {/* Skeleton loader for profile image */}
        <div className="flex items-center mb-2">
          <div className="w-[55px] h-[55px] bg-gray-300 rounded-full mr-3" />
          <div className="w-40 h-4 bg-gray-300 rounded-lg" />
        </div>

        {/* Skeleton loader for comment text */}
        <div className="mt-2">
          <div className="w-full h-4 bg-gray-300 rounded-lg mb-2" />
          <div className="w-3/4 h-4 bg-gray-300 rounded-lg" />
        </div>

        {/* Skeleton loader for reply button */}
        <div className="mt-4">
          <div className="w-16 h-4 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default CommentSkeletonLoader;
