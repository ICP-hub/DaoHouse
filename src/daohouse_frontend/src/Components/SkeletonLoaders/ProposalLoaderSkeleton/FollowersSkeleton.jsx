import React from "react";
import Skeleton from "@mui/material/Skeleton";

const FollowersSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex w-full flex-row items-center justify-between border border-[#97C3D3] rounded-lg big_phone:p-4 p-2"
        >
          <section className="flex flex-row items-center gap-2">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex flex-col items-start">
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={80} height={15} />
            </div>
          </section>
          <Skeleton variant="rectangular" width={30} height={30} />
        </div>
      ))}
    </>
  );
};

export default FollowersSkeleton;
