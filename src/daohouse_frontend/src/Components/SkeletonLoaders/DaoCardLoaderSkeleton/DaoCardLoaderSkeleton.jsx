import React from 'react'

const DaoCardLoaderSkeleton = () => {
  return (
    <div className='flex flex-wrap justify-start md:mx-10 xl:mx-40 gap-10'>
        {[...Array(4)].map((_, index) => (
    <div key={index} className="bg-[#F4F2EC] shadow-lg tablet:p-6 big_phone:p-3 small_phone:p-5 p-3  rounded-lg mr-12 ml-8 animate-pulse max-w-[350px] md:max-w-[800px]">
  <div className="flex big_phone:flex-row small_phone:flex-col justify-start items-start mb-4 gap-2">
    {/* Image Skeleton */}
    <div className="w-full big_phone:w-40 lg:w-60 h-[120px] bg-gray-300 border border-black rounded"></div>
    
    {/* Name and Follow button skeleton */}
    <div className="flex flex-col items-start big_phone:ml-4 small_phone:ml-0 small_phone:mt-4 space-y-2">
      {/* Name skeleton */}
      <div className="w-36 h-6 bg-gray-300 rounded hidden big_phone:block"></div>

      {/* Follow button skeleton */}
      <div className="w-20 h-4 bg-gray-300 rounded hidden big_phone:block"></div>
    </div>
  </div>

  {/* Adjusted flexbox for larger screens */}
  <div className="big_phone:flex hidden justify-between text-center mb-4 bg-white tablet:p-4 pb-4 p-2 rounded-lg gap-0">
    <div className="flex-1 ml-5">
      <div className="w-10 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-20 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="flex-1 text-center">
      <div className="w-10 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-20 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="flex-1 mr-5">
      <div className="w-10 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-20 h-4 bg-gray-300 rounded"></div>
    </div>
  </div>

  {/* Adjusted grid layout for smaller screens */}
  <div className="big_phone:hidden grid grid-cols-1 text-center my-5 mx-5 gap-1">
    <div className="bg-white rounded-lg py-4">
      <div className="w-10 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-20 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="bg-white rounded-lg py-4">
      <div className="w-10 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-20 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="bg-white rounded-lg py-4">
      <div className="w-10 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-20 h-4 bg-gray-300 rounded"></div>
    </div>
  </div>

  {/* Buttons skeleton */}
  <div className="flex justify-between gap-2 w-72 md:w-96">
    <div className="flex-1 bg-gray-300 w-20 h-10 rounded-[3rem]"></div>
    <div className="flex-1 bg-gray-300 w-20 h-10 rounded-[3rem]"></div>
  </div>
</div>
    ))}
    </div>
  )
}

export default DaoCardLoaderSkeleton
