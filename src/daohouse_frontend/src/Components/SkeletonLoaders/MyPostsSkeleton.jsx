// src/components/Proposals/MyPostsSkeleton.js

import React from "react";
import Skeleton from "@mui/material/Skeleton";

const MyPostsSkeleton = () => {
  const skeletonItems = Array.from({ length: 4 }); // Adjust to your itemsPerPage if needed

  return (
    <div className="flex flex-col gap-4 md:gap-6 p-2">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="bg-[#F4F2EC] p-4 rounded-lg flex flex-col gap-4 md:gap-6 w-full"
        >
          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            className="w-3/4 md:w-1/2"
            height={20}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
          />

          {/* Main content Skeleton */}
          <Skeleton
            variant="rectangular"
            className="w-full h-28 md:h-36 lg:h-44"
          />

          {/* Footer Section with Circle and Text */}
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton
              variant="text"
              className="flex-grow w-2/3 md:w-3/4"
              height={20}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPostsSkeleton;
