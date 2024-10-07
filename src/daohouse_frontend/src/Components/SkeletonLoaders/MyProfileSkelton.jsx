import React from 'react';

function MyProfileSkelton() {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto px-4 custom-scrollbar">
      {[1, 2, 3, 4].map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg flex items-center p-4 space-x-4 transition-transform transform"
        >
          {/* Skeleton for the avatar image */}
          <div className="rounded-full bg-gray-300 w-16 h-16" />

          {/* Skeleton for the text and button */}
          <div className="flex-1">
            <div className="h-5 bg-gray-300 rounded-md mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          </div>

          {/* Skeleton for the View Profile button */}
          <div className="bg-gray-300 rounded-full h-10 w-24"></div>
        </div>
      ))}
    </div>
  );
}

export default MyProfileSkelton;
