import React from 'react';

const VotingProgress = ({ votes, totalVotes, progressBarColor, status }) => {
    const percentage = (votes / totalVotes) * 100;

    // Calculate the position of the percentage text dynamically
    const percentageTextPosition = percentage > 5 ? `${percentage}%` : '0';

    return (
        <div className="flex flex-col items-start bg-white p-4 py-6 rounded-lg shadow-md w-full">
            <div className="flex justify-between w-full mb-2">
                <span className="text-sm font-semibold text-gray-700">Vote In {status}</span>
            </div>

            <div className='w-full flex justify-between gap-4 items-center'>
                <span className="text-3xl font-bold text-gray-700 py-2 px-6">{votes}</span>

                <div className="relative w-full h-2 bg-gray-300 rounded-full">
                    <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: progressBarColor }}
                    ></div>
                    <div
                        className="absolute top-0 transform -translate-y-1/2 text-white text-xs font-semibold p-2.5 rounded-full"
                        style={{ left: percentageTextPosition, backgroundColor: `${status === "Favour" ? "#0D6020" : "#8E0800"}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {Math.round(percentage)}%
                    </div>
                </div>
            </div>
        </div>
    );
};

VotingProgress.defaultProps = {
    progressBarColor: '#4caf50',
    status: 'Favour',
};

export default VotingProgress;
