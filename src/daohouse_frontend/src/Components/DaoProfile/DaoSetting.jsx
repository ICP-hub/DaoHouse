import React from 'react';

const DaoSetting = ({ daoDetails  }) => {
  
  return (
    <>
    <div class="container mx-auto p-6">
  <section class="mb-10">
    <h1 class="text-3xl font-bold text-center sm:text-4xl mb-6">Documentation on DAOs and Proposals</h1>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold sm:text-3xl mb-4">DAO Section</h2>

      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2 sm:text-2xl">What is a DAO?</h3>
        <p class="text-base sm:text-lg text-gray-700">
          A <strong>Decentralized Autonomous Organization (DAO)</strong> is a self-governing organization that operates
          without centralized control. Decisions are made collectively by its members using blockchain-based smart
          contracts. DAOs are designed for transparency, decentralization, and trustless collaboration.
        </p>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2 sm:text-2xl">Council</h3>
        <p class="text-base sm:text-lg text-gray-700">
          The <strong>Council</strong> is a governing body within the DAO, often consisting of experienced or elected
          members tasked with overseeing operations, initiating critical proposals, and ensuring the DAO functions as
          intended.
        </p>
        <ul class="list-disc pl-6 mt-2 text-base sm:text-lg">
          <li>Proposing and voting on strategic decisions.</li>
          <li>Managing DAO resources and treasury.</li>
          <li>Overseeing compliance with the DAO's policies and goals.</li>
        </ul>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2 sm:text-2xl">Role of Groups</h3>
        <p class="text-base sm:text-lg text-gray-700">
          Groups are sub-divisions within the DAO that handle specific responsibilities or projects. They streamline
          decision-making and ensure efficiency in task execution.
        </p>
        <ul class="list-disc pl-6 mt-2 text-base sm:text-lg">
          <li>Managing specialized tasks or initiatives.</li>
          <li>Providing expertise for specific projects.</li>
          <li>Acting as sub-governance units for focused decision-making.</li>
        </ul>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2 sm:text-2xl">Setup Period</h3>
        <p class="text-base sm:text-lg text-gray-700">
          The <strong>Setup Period</strong> is the initial phase of a DAO's creation, where key configurations are
          defined, such as:
        </p>
        <ul class="list-disc pl-6 mt-2 text-base sm:text-lg">
          <li>Defining roles (Council, Groups, Members).</li>
          <li>Establishing governance rules and thresholds.</li>
          <li>Determining initial token distribution and voting rights.</li>
        </ul>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2 sm:text-2xl">Threshold</h3>
        <p class="text-base sm:text-lg text-gray-700">
          The <strong>Threshold</strong> is the minimum number of votes or approvals required for a proposal to pass.
          It ensures that major decisions have broad consensus before being enacted.
        </p>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2 sm:text-2xl">Tokenization</h3>
        <p class="text-base sm:text-lg text-gray-700">
          Tokenization involves issuing tokens that represent membership, voting power, or ownership in the DAO. These
          tokens can be used for:
        </p>
        <ul class="list-disc pl-6 mt-2 text-base sm:text-lg">
          <li><strong>Governance:</strong> Voting on proposals.</li>
          <li><strong>Rewards:</strong> Incentivizing contributions.</li>
          <li><strong>Access:</strong> Granting permissions within the DAO ecosystem.</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-semibold sm:text-3xl mb-6">Proposal Section</h2>

    <div class="mb-6">
      <h3 class="text-xl font-bold mb-2 sm:text-2xl">What is a Proposal?</h3>
      <p class="text-base sm:text-lg text-gray-700">
        A <strong>Proposal</strong> is a formal suggestion or plan submitted by a DAO member or the council for
        consideration. Proposals are the foundation of DAO governance, enabling members to shape the DAO's direction.
      </p>
    </div>

    <div class="mb-6">
      <h3 class="text-xl font-bold mb-2 sm:text-2xl">Types of Proposals</h3>
      <ul class="list-disc pl-6 mt-2 text-base sm:text-lg space-y-2">
        <li><strong>RemoveMemberToDaoProposal:</strong> Removes a member from the DAO due to inactivity, misconduct, or other valid reasons.</li>
        <li><strong>ChangeDaoConfig:</strong> Updates the DAO's configuration, such as governance rules or operational settings.</li>
        <li><strong>BountyDone:</strong> Confirms the completion of a bounty task and authorizes rewards distribution.</li>
        <li><strong>Polls:</strong> Allows DAO members to vote on general topics or decisions that may not require immediate action.</li>
        <li><strong>ChangeDaoPolicy:</strong> Alters the policies governing the DAO's operations and decision-making processes.</li>
        <li><strong>MintNewTokens:</strong> Issues new tokens to the DAO, either for treasury purposes or to reward contributors.</li>
        <li><strong>TokenTransfer:</strong> Authorizes the transfer of tokens between members, groups, or external parties.</li>
        <li><strong>AddMemberToDaoProposal:</strong> Adds a new member to the DAO, granting them voting rights and other privileges.</li>
        <li><strong>RemoveMemberToGroupProposal:</strong> Removes a member from a specific group within the DAO.</li>
        <li><strong>BountyRaised:</strong> Creates a bounty proposal for a specific task or project, outlining the reward and requirements.</li>
        <li><strong>AddMemberToGroupProposal:</strong> Adds a new member to a specific group within the DAO.</li>
        <li><strong>GeneralPurpose:</strong> A flexible proposal type for topics that do not fall into predefined categories.</li>
      </ul>
    </div>

    <div>
      <h3 class="text-xl font-bold mb-2 sm:text-2xl">How Proposals Work</h3>
      <ol class="list-decimal pl-6 mt-2 text-base sm:text-lg space-y-2">
        <li><strong>Creation:</strong> Any member or council initiates a proposal.</li>
        <li><strong>Discussion:</strong> Members deliberate and provide feedback.</li>
        <li><strong>Voting:</strong> Members vote to approve or reject the proposal.</li>
        <li><strong>Execution:</strong> If approved, the proposal is implemented via smart contracts.</li>
      </ol>
    </div>
  </section>
</div>

    </>
  );
};

export default DaoSetting;



