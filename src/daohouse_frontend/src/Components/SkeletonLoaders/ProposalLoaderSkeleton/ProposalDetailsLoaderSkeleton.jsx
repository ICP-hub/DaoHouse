import React from 'react'
import ProposalLoaderSkeleton from './ProposalLoaderSkeleton'
import Container from '../../Container/Container'

const ProposalDetailsLoaderSkeleton = (isProposalDetails=false, showActions=false) => {
  return (
    <div>
      <div className={` bg-zinc-200 w-full relative h-full top-0`}>
     <Container classes="__mainComponent mt-4 lg:mt-[54px] lg:pb-20 py-6 big_phone:px-16 px-6 tablet:flex-row flex-col w-full animate-pulse">
    <div className="flex md:flex-row flex-col md:justify-between w-full items-center mb-12">
      
      {/* Left Section: Image and DAO Info */}
      <div className="flex flex-col md:flex-row items-center">
        {/* Image Loader */}
        <div className="w-[320px] h-[160px] lg:w-[240px] lg:h-[136px] bg-gray-300 md:w-[150px] md:h-[100px] rounded"></div>
        
        {/* DAO Info Loader */}
        <div className="lg:ml-10 ml-4 py-4 md:mt-0 w-full md:w-52 text-center md:text-left font-mulish font-semibold big_phone:text-lg">
          <div className="h-6 bg-gray-300 rounded w-48 lg:w-64"></div>
          <div className="relative w-full md:w-[40vw] lg:w-52 mt-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-32 mt-4"></div>
        </div>
      </div>
      
      {/* Right Section: Buttons */}
      <div className="flex flex-row-reverse md:flex-row justify-center md:justify-end md:items-center gap-4 w-full md:w-auto font-inter">
        {/* Follow Button Loader */}
        <div className="bg-gray-300 text-[16px] text-white shadow-xl lg:py-4 lg:px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-[98px] h-[35px]"></div>
        
        {/* Join Button Loader */}
        <div className="bg-gray-300 text-[16px] text-[#0E3746] shadow-xl lg:py-4 lg:px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-[98px] h-[35px]"></div>
      </div>
    </div>

    {/* Card and Comments Section */}
    <div>
      {/* Proposal Loader (Already Exists) */}
      <ProposalLoaderSkeleton isProposalDetails={isProposalDetails} showActions={showActions} />
      
      {/* Comments Section Loader */}
      <div className="mt-6">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-full mt-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
      </div>
    </div>
  </Container>
</div>

    </div>
  )
}

export default ProposalDetailsLoaderSkeleton
