import React from 'react'

const ProposalLoaderSkeleton = (isProposalDetails=false, showActions=false) => {
  return (
    <div className={`bg-white font-mulish ${isProposalDetails ? "rounded-t-xl": "rounded-xl" } shadow-md flex flex-col md:flex-col animate-pulse mx-20`}>
    {/* Top Section */}
    <div className="w-full flex justify-between items-center bg-gray-300 px-[20px] md:px-12 py-6 rounded-t-lg rounded-b-none">
        <div className="flex gap-[12px] md:gap-8 justify-center items-center">
            <div className="w-8 h-8 md:w-16 md:h-16 bg-gray-400 rounded-full"></div>
            <div className="w-24 h-6 md:w-36 md:h-8 bg-gray-400"></div>
        </div>
        <div className="flex gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                <div className="w-12 h-4 bg-gray-400 mt-2"></div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                <div className="w-12 h-4 bg-gray-400 mt-2"></div>
            </div>
        </div>
    </div>

    {/* Bottom Section */}
    <div className="w-full px-4 lg:px-12 py-4 md:py-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-4">
            <div className="max-w-full lg:max-w-full">
                <div className="w-[700px] h-6 bg-gray-400"></div>
            </div>
            <div className="flex gap-4">
                <div className="w-24 h-6 bg-gray-400 rounded-full"></div>
                <div className="w-24 h-6 bg-gray-400 rounded-full"></div>
            </div>
        </div>
        <div className="w-full h-4 bg-gray-400 mb-4"></div>
        <div className="flex flex-wrap gap-4 flex-col  items-start ">
            <div className="flex flex-col gap-4 items-start justify-start">
                <div className="flex mobile:space-x-2 xl:space-x-8">
                    <div className="w-24 h-4 bg-gray-400"></div>
                    <div className="w-24 h-4 bg-gray-400"></div>
                    <div className="w-24 h-4 bg-gray-400"></div>
                </div>
            </div>
            <div className="flex flex-wrap justify-start md:justify-start md:mt-0 space-x-2 small_phone:space-x-4">
                <div className="w-24 h-6 bg-gray-400 rounded-full"></div>
                <div className="w-24 h-6 bg-gray-400 rounded-full"></div>
            </div>
        </div>
        {showActions && (
        <div className="bg-sky-200 w-full md:w-96 p-4 rounded-md mt-6 animate-pulse">
            <div className="w-32 h-6 bg-gray-300 rounded"></div>
            <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
        </div>
    )}
    
    {!showActions && (
      <div className="mt-4 xl:mt-8 bg-[#CDEFFE] w-32 h-10 bg-gray-300 rounded-xl animate-pulse"></div>
    )}
    </div>
</div>

  )
}

export default ProposalLoaderSkeleton
