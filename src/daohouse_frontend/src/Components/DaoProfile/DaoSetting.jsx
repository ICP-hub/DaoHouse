import React from "react";
import { FaUsers, FaGavel } from "react-icons/fa";
import Container from "../Container/Container"

const DaoSetting = () => {
  return (
    <Container>
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
                  is a self-governing organization that operates without centralized control. Decisions are made collectively by its members using blockchain-based smart contracts. DAOs are designed for transparency, decentralization, and trustless collaboration.
                </p>
              </div>

              {/* Types of DAOs */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold font-mulish">
                  Types of DAOs
                </h3>
                <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-sm sm:text-base font-mulish">
                  <li>
                    <strong>Public DAO:</strong> Creating a proposal is required to add a new member to the organization, ensuring collective decision-making.
                  </li>
                  <li>
                    <strong>Private DAO:</strong> Members can be added without the need for a proposal, allowing quicker and streamlined member management.
                  </li>
                </ul>
              </div>

              {/* Council */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold font-mulish">
                  Council
                </h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                  The Council is a governing body within the DAO, often consisting of experienced or elected members tasked with overseeing operations, initiating critical proposals, and ensuring the DAO functions as intended.
                </p>
                <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-sm sm:text-base font-mulish">
                  <li>Proposing and voting on strategic decisions.</li>
                  <li>Managing DAO resources and treasury.</li>
                  <li>Overseeing compliance with the DAO's policies and goals.</li>
                </ul>
              </div>

              {/* Group Definition */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold font-mulish">
                  Group Definition
                </h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                  A group is a collection of members within the DAO assigned specific permissions to perform similar actions or tasks. Groups streamline collaboration and ensure members with shared responsibilities can efficiently work together under defined permissions.
                </p>
              </div>

              {/* Setup Period */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold font-mulish">
                  Setup Period
                </h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                  The Setup Period is the duration defined for a proposal before it expires. During this period, members can review, discuss, and vote on the proposal before its conclusion.
                </p>
              </div>

              {/* Threshold */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold font-mulish">
                  Threshold
                </h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                  The Threshold is the minimum percentage of votes or approvals required for a proposal to pass. It ensures that significant decisions have sufficient support before being implemented.
                </p>
              </div>

              {/* Tokenization */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold font-mulish">
                  Tokenization
                </h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                  Tokenization involves issuing tokens that represent membership, voting power, or ownership in the DAO. These tokens can be used for:
                </p>
                <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-sm sm:text-base font-mulish">
                  <li>
                    <strong>Governance:</strong> Voting on proposals.
                  </li>
                  <li>
                    <strong>Rewards:</strong> Incentivizing contributions.
                  </li>
                </ul>
              </div>

              {/* Total Supply of DAO Tokens */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold font-mulish">
                  Total Supply of DAO Tokens
                </h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed font-mulish">
                  The Total Supply of DAO tokens refers to the maximum number of tokens that will be minted and made available within the DAO ecosystem. This represents the full quantity of tokens the DAO plans to issue for purposes such as:
                </p>
                <ul className="list-disc pl-5 mt-2 sm:mt-4 space-y-2 text-sm sm:text-base font-mulish">
                  <li>
                    <strong>Governance:</strong> Enabling voting rights for members.
                  </li>
                  <li>
                    <strong>Rewards:</strong> Distributing tokens as incentives for contributions.
                  </li>
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
  <ul className="list-disc pl-6 mt-2 sm:mt-4 space-y-2  text-sm sm:text-base font-mulish text-[14px] lg:text-[15px]">
    <li>
      <strong>Remove Member To Dao Proposal:</strong> Removes a member from the DAO due to inactivity, misconduct, or other valid reasons.
    </li>
    <li>
      <strong>Change DaoConfig:</strong> Updates the DAO's configuration, such as governance rules or operational settings.
    </li>
    <li>
      <strong>Bounty Done:</strong> Confirms the completion of a bounty task and authorizes rewards distribution.
    </li>
    <li>
      <strong>Polls:</strong> Allows DAO members to vote on general topics or decisions that may not require immediate action.
    </li>
    <li>
      <strong>Change Dao Policy:</strong> Alters the policies governing the DAO's operations and decision-making processes.
    </li>
    <li>
      <strong>Mint New Tokens:</strong> Issues new tokens to the DAO, either for treasury purposes or to reward contributors.
    </li>
    <li>
      <strong>Token Transfer:</strong> Authorizes the transfer of tokens between members, groups, or external parties.
    </li>
    <li>
      <strong>Add Member To Dao Proposal:</strong> Adds a new member to the DAO, granting them voting rights and other privileges.
    </li>
    <li>
      <strong>Remove Member To Group Proposal:</strong> Removes a member from a specific group within the DAO.
    </li>
    <li>
      <strong>Bounty Raised:</strong> Creates a bounty proposal for a specific task or project, outlining the reward and requirements.
    </li>
    <li>
      <strong>Add Member To Group Proposal:</strong> Adds a new member to a specific group within the DAO.
    </li>
    <li>
      <strong>General Purpose:</strong> A flexible proposal type for topics that do not fall into predefined categories.
    </li>
  </ul>
</div>

            {/* How Proposals Work */}
            <div>
              <h3 className="text-md sm:text-lg font-semibold font-mulish">
                How Proposals Work
              </h3>
              <ol className="list-decimal pl-5 mt-2 sm:mt-4  text-sm sm:text-base  text-[14px] font-mulish space-y-2 ">
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
    </Container>
  );
};

export default DaoSetting;
