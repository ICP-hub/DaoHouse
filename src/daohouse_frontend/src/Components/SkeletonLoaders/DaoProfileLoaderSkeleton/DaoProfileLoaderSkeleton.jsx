import React from 'react'
import ProposalLoaderSkeleton from '../ProposalLoaderSkeleton/ProposalLoaderSkeleton'

const DaoProfileLoaderSkeleton = () => {
  return (
    
    <div className=''>
      <div className='p-32 w-[100%] bg-[#8f9da8]'></div>
      <div className="bg-zinc-200 w-full relative flex-col space-y-16">
    
    <div className="bg-[#c8ced3] p-6 flex flex-col gap-2">
      {/* DAO Image Placeholder */}
      <div className="flex items-start gap-4">
        <div className="w-[85px] h-[49px] lg:w-[207px] lg:h-[120px] bg-gray-300 rounded-md animate-pulse"></div>
        {/* DAO Text Info Placeholder */}
        <div className="flex flex-col gap-2">
          <div className="bg-gray-300 h-6 w-[50vw] lg:w-[30vw] rounded-md animate-pulse"></div>
          <div className="bg-gray-300 h-4 w-[65vw] lg:w-[50vw] rounded-md animate-pulse"></div>
        </div>
      </div>
      {/* Proposals and Followers Count Placeholder */}
      <div className="flex justify-between mt-4">
        <div className="bg-gray-300 h-4 w-20 rounded-md animate-pulse"></div>
        <div className="bg-gray-300 h-4 w-20 rounded-md animate-pulse"></div>
      </div>
      {/* Buttons Placeholder */}
      <div className="flex gap-4 mt-4">
        <div className="bg-gray-400 h-10 w-[98px] rounded-xl animate-pulse"></div>
        <div className="bg-gray-400 h-10 w-[98px] rounded-xl animate-pulse"></div>
      </div>
    </div>
    <ProposalLoaderSkeleton />
  </div>
    </div>

  )
}

export default DaoProfileLoaderSkeleton
