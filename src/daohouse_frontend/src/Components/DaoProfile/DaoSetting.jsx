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
                    Determining the total supply is a crucial step in DAO creation as it directly impacts token distribution, scarcity, and the overall tokenomics of the organization.
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
        A proposal in a DAO (Decentralized Autonomous Organization) is a formal suggestion or request made by a member of the DAO for a change, action, or decision to be implemented within the organization. Proposals are typically used to govern and guide the direction of the DAO, and they may cover a wide range of topics, such as financial decisions, changes in the DAO's rules, membership changes, or even the allocation of resources.
      </p>
    </div>

    {/* Types of Proposals */}
    <div>
      <h3 className="text-md sm:text-lg font-semibold font-mulish">
        Types of Proposals
      </h3>
      <ul className="list-disc pl-6 mt-2 sm:mt-4 space-y-6 text-sm sm:text-base font-mulish">
        <li>
          <strong>Remove Member To Dao Proposal:</strong> The RemoveMemberToDaoProposal is a formal process within the DAO that allows members to propose the removal of an individual from the organization. This proposal type is used to maintain the integrity, efficiency, and alignment of the DAO by addressing specific issues with a member.
        </li>
        <li>
          <strong>Change DaoConfig:</strong> The ChangeDaoConfig proposal lets members update important details of the DAO, such as changing its name or updating its purpose. This helps the DAO stay aligned with its goals and ensures that the community is involved in making these important decisions.
        </li>
        <li>
          <strong>Bounty Done:</strong> Confirms the completion of a bounty task and authorizes rewards distribution.
        </li>
        <li>
          <strong>Polls:</strong> A Poll Proposal in a DAO is a type of proposal that is primarily used to gather opinions or preferences from the members of the DAO on a specific issue, without necessarily implementing any immediate changes based on the result. It can be seen as a mechanism to assess the general sentiment or direction of the community before a formal proposal or decision is made.
        </li>
        <li>
          <strong>Change Dao Policy:</strong> In this proposal, members can specify the required vote threshold for approval, set a voting period, and decide whether the DAO will operate as public or private. This ensures flexibility in adapting the DAO's framework to evolving needs while maintaining transparency and member participation.
        </li>
        <li>
          <strong>Mint New Tokens:</strong> Issues new tokens to the DAO, either for treasury purposes or to reward contributors.
        </li>
        <li>
          <strong>Token Transfer:</strong> The Token Transfer proposal type authorizes the transfer of tokens between members, groups, or external parties. When creating this proposal, the member's Principal ID is gathered to specify the recipient of the token transfer. This ensures that tokens are transferred to the correct individual or entity, with the DAO's members providing approval for the transaction. The proposal may include the transfer amount, recipient details, and a defined approval process before execution.
        </li>
        <li>
          <strong>Add Member To Council Proposal:</strong> The Add Member to Council Proposal allows DAO members to propose adding a new member, granting them voting rights and other privileges. The proposal includes the new member's Principal ID, and after voting, if approved, the new member gains access to participate in DAO decisions and activities.
        </li>
        <li>
          <strong>Remove Member To Group Proposal:</strong> The Remove Member from Group Proposal allows DAO members to propose the removal of a member from a specific group within the DAO. If approved, the member loses access to the group’s privileges and participation, while still remaining a member of the DAO.
        </li>
        <li>
          <strong>Bounty Raised:</strong> The Bounty Raised proposal creates a bounty for a specific task or project within the DAO, detailing the reward for completion and the requirements or criteria for earning it. Members can propose tasks, and if approved, the bounty is set, offering incentives for individuals or groups to complete the designated work.
        </li>
        <li>
          <strong>Add Member To Group Proposal:</strong> The Add Member to Group Proposal allows DAO members to propose adding a new member to a specific group within the DAO. If approved, the new member gains access to the group's privileges and can participate in its activities.
        </li>
        <li>
          <strong>General Purpose:</strong> The General Purpose proposal is a flexible type used for topics that don't fit into predefined categories. It allows DAO members to propose and vote on a wide range of issues, providing flexibility for a variety of topics or decisions.
        </li>
      </ul>
    </div>

          {/* How Proposals Work */}
          <div>
           <h3 className="text-md sm:text-lg font-semibold font-mulish">
        How Proposals Work
         </h3>
          <ol className="list-decimal pl-5 mt-2 sm:mt-4 space-y-4 text-sm sm:text-base font-mulish">
        <li>
          <strong>Creation:</strong> A member submits a proposal, detailing the topic or action (e.g., adding a member, transferring tokens, changing policies). The proposal will include relevant information such as conditions, voting options, and any supporting details.
        </li>
        <li>
          <strong>Voting:</strong> Once the proposal is created, DAO members vote on it. Voting options may include "In Favor", "Against", or other choices based on the proposal type. The voting process is time-bounded, with a set deadline for voting.
        </li>
        <li>
          <strong>Approval/Denial:</strong> After the voting period ends, the proposal is evaluated. If it meets the required majority or quorum (e.g., a certain percentage of "In Favor" votes), it is approved. If it fails to meet the required threshold, it is denied.
        </li>
        <li>
          <strong>Execution:</strong> If approved, the proposal is executed, and the intended action is carried out (e.g., a new member is added, tokens are transferred, or policies are changed).
        </li>
        <li>
          <strong>Outcome:</strong> The results of the proposal (approved or denied) are communicated to the DAO members, and the action is taken as outlined in the proposal.
        </li>
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
