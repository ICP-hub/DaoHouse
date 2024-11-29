import React from "react";
import { FaUsers, FaGavel } from "react-icons/fa";

const DaoSetting = () => {
  return (
    <div className="bg-[#F4F2EC] rounded-xl px-4 sm:px-6 md:px-8 lg:px-20 py-8 sm:py-10 md:py-12 lg:py-16 text-white">
      {/* Header Section */}
      <header className="text-center mb-12 sm:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold font-mulish text-black">
          DAOs and Proposals Documentation
        </h1>
        <p className="mt-4 sm:mt-6 text-[15px] text-slate-500 text-black">
          A comprehensive guide to understanding Decentralized Autonomous Organizations and their proposal mechanisms.
        </p>
      </header>

      {/* Content Section */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* DAO Section */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl shadow-lg transform transition duration-500  hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <FaUsers className="text-4xl sm:text-5xl text-black bg-indigo-500 p-3 rounded-full shadow-md animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-bold font-mulish ml-4 text-black">
              DAO Section
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6 text-black">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold font-mulish">
                What is a DAO?
              </h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed">
                A{" "}
                <strong className="text-black">
                  Decentralized Autonomous Organization (DAO)
                </strong>{" "}
                is a self-governing entity where decisions are made collectively by its members using blockchain-based smart contracts.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold font-mulish">
                Council
              </h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed">
                The <strong className="text-black">Council</strong> oversees governance, strategy, and compliance within the DAO.
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-sm sm:text-base">
                <li>Proposing and voting on strategic decisions.</li>
                <li>Managing DAO resources and treasury.</li>
                <li>Ensuring compliance with policies and goals.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold font-mulish">
                Role of Groups
              </h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed">
                Groups within a DAO specialize in specific tasks or initiatives for streamlined operations.
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-sm sm:text-base">
                <li>Specialized task management.</li>
                <li>Providing expertise for specific projects.</li>
                <li>Sub-governance units for decision-making.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Proposal Section */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl shadow-lg transform transition duration-500  hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <FaGavel className="text-4xl sm:text-5xl text-black bg-green-300 p-3 rounded-full shadow-md animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-bold text-black ml-4 font-mulish">
              Proposal Section
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6 text-black">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold font-mulish">
                What is a Proposal?
              </h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed">
                A <strong className="text-black">Proposal</strong> is a formal suggestion or plan submitted by DAO members for consideration.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold font-mulish">
                Types of Proposals
              </h3>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-sm sm:text-base">
                <li>
                  <strong className="text-black font-mulish">
                    RemoveMemberToDaoProposal:
                  </strong>{" "}
                  Remove a member for valid reasons.
                </li>
                <li>
                  <strong className="text-black font-mulish">
                    ChangeDaoConfig:
                  </strong>{" "}
                  Modify the DAO's configuration.
                </li>
                <li>
                  <strong className="text-black font-mulish">
                    MintNewTokens:
                  </strong>{" "}
                  Generate new tokens for rewards or treasury.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold font-mulish">
                How Proposals Work
              </h3>
              <ol className="list-decimal pl-5 mt-4 space-y-2 text-sm sm:text-base">
                <li>
                  <strong className="text-black font-mulish">Creation:</strong> Members initiate proposals.
                </li>
                <li>
                  <strong className="text-black font-mulish">Discussion:</strong> Feedback and deliberation among members.
                </li>
                <li>
                  <strong className="text-black font-mulish">Voting:</strong> Approving or rejecting proposals.
                </li>
                <li>
                  <strong className="text-black font-mulish">Execution:</strong>{" "}
                  Implementation of approved proposals.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoSetting;
