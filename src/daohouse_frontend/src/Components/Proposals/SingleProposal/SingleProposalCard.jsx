import React from 'react';
import VotingProgress from './VotingProgress';

const SingleProposalCard = ({ id, status, timeLeft, description, submittedOn, expiresOn, votesRequired, votesInFavour, votesAgainst, comments, shares, voters }) => {
  return (
    <div className="bg-[#F4F2EC] shadow-md rounded-lg p-6">



        <div className="flex items-center justify-between">

          <h3 className="text-lg font-semibold">Description</h3>

          <div className="flex items-center space-x-2 ml-auto">
            <span className="px-4 py-1 bg-[#D4C36B]  text-white rounded-full text-sm">{status}</span>
            <span className="px-4 py-1 bg-[#4993B0] text-white rounded-full text-sm">{timeLeft} left</span>
          </div>
        </div>
        <div>
          {description.map((desc, index) => (
            <p key={index} className="mt-2 text-[16px] text-black">
              {desc}
            </p>
          ))}
        </div>
        <div className="my-6 grid grid-cols-3 gap-4 text-gray-700">
          <div>
            <span className="font-semibold text-[16px]">Submitted On</span>
            <span className="block text-[16px]">{submittedOn}</span>
          </div>
          <div>
            <span className="font-semibold text-[16px]">Expires On</span>
            <span className="block text-[16px]">{expiresOn}</span>
          </div>

          <div>
            <span className="font-semibold text-[16px]">Votes Required</span>
            <span className="block text-[16px]">{votesRequired}</span>
          </div>
        </div>
        <div className="my-4 w-full grid grid-cols-2 gap-4">
          <VotingProgress votes={7} totalVotes={10} progressBarColor="#329F4A  " progressBarWidth="400px"  status="Favour"  />
          <VotingProgress votes={2} totalVotes={10} progressBarColor="#BE2200" progressBarWidth="400px" status="Against" />

        </div>
        <div className="my-4 flex justify-around text-gray-700">
          <div className="text-center">
            <span className="block text-xl font-semibold">{comments}</span>
            <span>Comments</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-semibold">{shares}</span>
            <span>Share</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-semibold">{voters}</span>
            <span>Voters</span>
          </div>
        </div>
      </div>
  );
};

export default SingleProposalCard;
