import React from 'react';

const CommentsSkeletonLoader = () => {
  return (
    <div className="bg-white mt-1 rounded-t-sm rounded-b-lg px-12 py-12 font-mulish">
      {/* Comments Title Loader */}
      <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>

      {/* Single Comment Loaders */}
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="flex mb-6 animate-pulse">
          {/* Profile Image Skeleton */}
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>

          {/* Comment Text Skeleton */}
          <div className="flex flex-col space-y-2">
            <div className="h-4 bg-gray-300 rounded w-64"></div>
            <div className="h-3 bg-gray-300 rounded w-48"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      ))}

      {/* "View More Comments" Button Loader */}
      <div className="h-4 bg-gray-300 rounded w-36 mt-4 mb-8"></div>

      {/* Write Comment Section Loaders */}
      <div className="mt-8">
        {/* Textarea Skeleton */}
        <div className="w-full h-20 bg-gray-300 rounded-lg mb-4"></div>

        {/* Submit Button Skeleton */}
        <div className="flex justify-end">
          <div className="h-10 bg-gray-300 rounded-full w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSkeletonLoader;
