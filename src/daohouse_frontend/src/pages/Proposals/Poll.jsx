import React from "react";

const Poll = ({ poll, handleInputPoll }) => (
    <form className="space-y-4">
        <div className="mb-4">
            <label htmlFor="pollTitle">Poll Title</label>
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
            <label htmlFor="description">Description</label>
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
            <label htmlFor="actionMember">Action Member (Principal)</label>
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
            <label htmlFor="proposalCreatedAt">Proposal Created At</label>
            <input
                id="proposalCreatedAt"
                type="date"
                name="proposal_created_at"
                value={poll.proposal_created_at}
                onChange={handleInputPoll}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="proposalExpiredAt">Proposal Expired At</label>
            <input
                id="proposalExpiredAt"
                type="date"
                name="proposal_expired_at"
                value={poll.proposal_expired_at}
                onChange={handleInputPoll}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
            />
        </div>
    </form>
);

export default Poll;
