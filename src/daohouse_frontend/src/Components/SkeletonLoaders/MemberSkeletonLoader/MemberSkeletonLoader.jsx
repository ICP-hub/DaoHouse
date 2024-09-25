import React from 'react';

const MemberCardSkeleton = () => {
  return (
    <div className="flex items-center mb-4 justify-between cursor-pointer p-2 rounded-md bg-gray-100 animate-pulse">
      {/* Profile Image Loader */}
      <div className="flex items-center">
        <div className="w-12 h-12 mr-4 bg-gray-300 rounded-full"></div>

        {/* Username and User Info Loader */}
        <div>
          <div className="flex flex-col items-start">
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCardSkeleton;
