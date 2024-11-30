import React from "react";
import { FaUsers, FaGavel } from "react-icons/fa";

const DaoSetting = () => {
  return (
    <div className="bg-[#F4F2EC] rounded-xl px-4 sm:px-6 md:px-8 lg:px-20 py-8 sm:py-10 md:py-12 lg:py-16 text-white">
      {/* Header Section */}
      <header className="text-center mb-8 sm:mb-10 lg:mb-16">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold font-mulish text-black">
          DAOs and Proposals Documentation
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-500">
          A comprehensive guide to understanding Decentralized Autonomous Organizations and their proposal mechanisms.
        </p>
      </header>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-row-1 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        {/* DAO Section */}
        <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-3xl shadow-lg transform transition duration-500 hover:shadow-2xl">
          <div className="flex items-center mb-4 sm:mb-6">
            <FaUsers className="text-3xl sm:text-4xl lg:text-5xl text-black bg-indigo-500 p-2 sm:p-3 rounded-full shadow-md animate-bounce" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-mulish ml-3 text-black">
              DAO Section
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4 text-black">
            {/* What is a DAO */}
            <div>
              <h3 className="text-md sm:text-lg font-semibold font-mulish">
                What is a DAO?
              </h3>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                A{" "}
                <strong className="text-black">
                  Decentralized Autonomous Organization (DAO)
                </strong>{" "}
                is a self-governing entity where decisions are made collectively by its members using blockchain-based smart contracts.
              </p>
            </div>

            {/* Council */}
            <div>
              <h3 className="text-md sm:text-lg font-semibold font-mulish">
                Council
              </h3>
              <p className="mt-1 sm:mt-2 text-[14px] font-mulish">
                The <strong className="text-black">Council</strong> oversees governance, strategy, and compliance within the DAO.
              </p>
              <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-[14px] font-mulish">
                <li>Proposing and voting on strategic decisions.</li>
                <li>Managing DAO resources and treasury.</li>
                <li>Ensuring compliance with policies and goals.</li>
              </ul>
            </div>

            {/* Role of Groups */}
            <div>
              <h3 className="text-md sm:text-lg font-semibold font-mulish">
                Role of Groups
              </h3>
              <p className="mt-1 sm:mt-2 text-[14px] leading-relaxed font-mulish">
                Groups within a DAO specialize in specific tasks or initiatives for streamlined operations.
              </p>
              <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-[14px] font-mulish">
                <li>Specialized task management.</li>
                <li>Providing expertise for specific projects.</li>
                <li>Sub-governance units for decision-making.</li>
              </ul>
            </div>

            {/* Setup Period */}
            <div>
              <h3 className="text-md sm:text-lg font-semibold font-mulish">
                Setup Period
              </h3>
              <p className="mt-1 sm:mt-2 text-[14px] leading-relaxed font-mulish">
                The <strong>Setup Period</strong> is the initial phase of a DAO's creation, where key configurations are defined, such as:
              </p>
              <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-[14px] font-mulish">
                <li>Defining roles (Council, Groups, Members).</li>
                <li>Establishing governance rules and thresholds.</li>
                <li>Determining initial token distribution and voting rights.</li>
              </ul>
            </div>

            {/* Tokenization */}
            <div>
            <h3 className="text-md sm:text-lg font-semibold font-mulish">
                Tokenization
              </h3>
              <p className="mt-1 sm:mt-2 text-[14px] leading-relaxed font-mulish">
                Tokenization involves issuing tokens that represent membership, voting power, or ownership in the DAO. These tokens can be used for:
              </p>
              <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-[14px] font-mulish">
                <li><strong>Governance:</strong> Voting on proposals.</li>
                <li><strong>Rewards:</strong> Incentivizing contributions.</li>
                <li><strong>Access:</strong> Granting permissions within the DAO ecosystem.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Proposal Section */}
        <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-3xl shadow-lg transform transition duration-500 hover:shadow-2xl">
          <div className="flex items-center mb-4 sm:mb-6">
            <FaGavel className="text-3xl sm:text-4xl lg:text-5xl text-black bg-green-300 p-2 sm:p-3 rounded-full shadow-md animate-bounce" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-mulish ml-3 text-black">
              Proposal Section
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4 text-black">
            {/* What is a Proposal */}
            <div>
              <h3 className="text-md sm:text-lg font-semibold font-mulish">
                What is a Proposal?
              </h3>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                A <strong className="text-black">Proposal</strong> is a formal suggestion or plan submitted by DAO members for consideration.
              </p>
            </div>

            {/* Types of Proposals */}
            <div>
  <h3 className="text-md sm:text-lg font-semibold font-mulish">
    Types of Proposals
  </h3>
  <ul className="list-disc pl-6 mt-2 sm:mt-4 space-y-2 font-mulish text-[13px] lg:text-[14px]">
    <li>
      <strong>RemoveMemberToDaoProposal:</strong> Removes a member from the DAO due to inactivity, misconduct, or other valid reasons.
    </li>
    <li>
      <strong>ChangeDaoConfig:</strong> Updates the DAO's configuration, such as governance rules or operational settings.
    </li>
    <li>
      <strong>BountyDone:</strong> Confirms the completion of a bounty task and authorizes rewards distribution.
    </li>
    <li>
      <strong>Polls:</strong> Allows DAO members to vote on general topics or decisions that may not require immediate action.
    </li>
    <li>
      <strong>ChangeDaoPolicy:</strong> Alters the policies governing the DAO's operations and decision-making processes.
    </li>
    <li>
      <strong>MintNewTokens:</strong> Issues new tokens to the DAO, either for treasury purposes or to reward contributors.
    </li>
    <li>
      <strong>TokenTransfer:</strong> Authorizes the transfer of tokens between members, groups, or external parties.
    </li>
    <li>
      <strong>AddMemberToDaoProposal:</strong> Adds a new member to the DAO, granting them voting rights and other privileges.
    </li>
    <li>
      <strong>RemoveMemberToGroupProposal:</strong> Removes a member from a specific group within the DAO.
    </li>
    <li>
      <strong>BountyRaised:</strong> Creates a bounty proposal for a specific task or project, outlining the reward and requirements.
    </li>
    <li>
      <strong>AddMemberToGroupProposal:</strong> Adds a new member to a specific group within the DAO.
    </li>
    <li>
      <strong>GeneralPurpose:</strong> A flexible proposal type for topics that do not fall into predefined categories.
    </li>
  </ul>
</div>

            {/* How Proposals Work */}
            <div>
              <h3 className="text-md sm:text-lg font-semibold font-mulish">
                How Proposals Work
              </h3>
              <ol className="list-decimal pl-5 mt-2 sm:mt-4  text-[14px] font-mulish space-y-2 ">
                <li><strong>Creation:</strong> Members initiate proposals.</li>
                <li><strong>Discussion:</strong> Feedback and deliberation among members.</li>
                <li><strong>Voting:</strong> Approving or rejecting the proposal based on token weight.</li>
                <li><strong>Execution:</strong> Successful proposals are implemented.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoSetting;
