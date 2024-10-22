import React from "react";
import Skeleton from "@mui/material/Skeleton";

const MemberSkeleton = ({ gridView }) => {
  return (
    <div
      className={gridView
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" // Responsive grid
        : "flex flex-col gap-4"} // Flex for list view
    >
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="flex flex-col p-4 border border-[#97C3D3] rounded-lg"
        >
          <div className="top flex flex-row items-start justify-between">
            {/* Skeleton for circular avatar */}
            <section className="relative w-16 h-16 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
              <Skeleton variant="circular" width="100%" height="100%" />
            </section>

            {/* Details section skeleton */}
            <section className="details flex flex-col items-start ml-4 flex-1">
              <Skeleton
                variant="text"
                width="80%"
                height={24}
                className="sm:w-3/4 lg:w-full"
              />
              <Skeleton
                variant="text"
                width="100%"
                height={16}
                className="sm:w-2/3 lg:w-full mt-2"
              />
            </section>

            {/* Rectangular skeleton for the action icon */}
            <Skeleton
              variant="rectangular"
              width={40}
              height={40}
              className="ml-2 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberSkeleton;
