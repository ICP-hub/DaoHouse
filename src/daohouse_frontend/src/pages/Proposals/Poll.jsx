import React, { useEffect } from "react";

const Poll = ({ poll, handleInputPoll, setPoll }) => {
    // Get today's date in the format YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        // Set today's date for "Created At" field when the component loads
        setPoll((prevPoll) => ({
            ...prevPoll,
            proposal_created_at: getTodayDate(),
        }));
    }, [setPoll]);

    return (
        <form className="space-y-4">
            <div className="mb-4">
                <label htmlFor="pollTitle" className="mb-2 font-semibold text-xl">Poll Title</label>
                <input
                    id="pollTitle"
                    type="text"
                    name="poll_title"
                    value={poll.poll_title}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Poll Title"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
                <input
                    id="description"
                    type="text"
                    name="description"
                    value={poll.description}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Description"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="actionMember" className="mb-2 font-semibold text-xl">Action Member (Principal)</label>
                <input
                    id="actionMember"
                    type="text"
                    name="action_member"
                    value={poll.action_member}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Action Member Principal"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="proposalCreatedAt" className="mb-2 font-semibold text-xl">Created At</label>
                <input
                    id="proposalCreatedAt"
                    type="date"
                    name="proposal_created_at"
                    value={poll.proposal_created_at}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    disabled // Disable the field
                />
            </div>

            <div className="mb-4">
                <label htmlFor="proposalExpiredAt" className="mb-2 font-semibold text-xl">Expires At</label>
                <input
                    id="proposalExpiredAt"
                    type="date"
                    name="proposal_expired_at"
                    value={poll.proposal_expired_at}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    min={getTodayDate()} // Set minimum date to today's date
                />
            </div>
            
        </form>
    );
};

export default Poll;
