import React, { useState, useEffect } from "react";
import Card from "../Proposals/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../../Components/utils/useAuthClient";
import nodata from "../../../assets/nodata.png";

const ProposalsContent = ({ proposals, isMember, showActions = true, voteApi, daoCanisterId, sortOrder="newest", setSortOrder }) => {
  const { createDaoActor } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedProposals, setFetchedProposals] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const allProposals = proposals && Array.isArray(proposals) ? proposals : [];
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getproposal = async () => {
    if (searchTerm.trim() === "") {
      setFetchedProposals([]);
      return;
    }

    try {
      const daoActor = createDaoActor(daoCanisterId);
      const response = await daoActor.search_proposal(searchTerm);
      setFetchedProposals(response);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  useEffect(() => {
    getproposal();
  }, [searchTerm, createDaoActor, daoCanisterId]);

  const sortProposals = (proposalsToSort) => {
    return [...proposalsToSort].sort((a, b) => {
      const dateA = new Date(Number(a.proposal_submitted_at) / 1000000); 
      const dateB = new Date(Number(b.proposal_submitted_at) / 1000000);  
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };
  
  
  const displayedProposals =
    searchTerm.trim() === "" ? sortProposals(allProposals) : sortProposals(fetchedProposals);

  return (
    <div className="mt-6 mb-6">
      {isMember && showActions && (
        <div className="flex items-center justify-between">
          <h1 className="lg:text-[24px] md:text-[18px] text-[16px] font-bold">
            Proposals
          </h1>
          <Link
            to={`/create-proposal/${daoCanisterId}`}
            className="flex justify-center items-center text-[16px] relative lg:w-[220px] lg:h-[50px] md:w-[185px] md:h-[46px] w-[150px] h-[50px] bg-white rounded-full"
            style={{
              boxShadow:
                "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
            }}
          >
            <span className="text-[28px] font-thin mr-2">+</span>
            <span className="text-[14px] sm:text-[16px]">Create Proposal</span>
          </Link>
        </div>
      )}
      <div className={`${showActions ? "bg-[#F4F2EC] pt-3 pb-8 mt-4 mb-8 rounded-[10px] " : ""} `}>
        {showActions && (
          <div className="flex justify-between items-center px-6 mb-3">
            <span className="text-[20px] text-[#05212C] font-semibold">All</span>
            <span className="flex items-center">

              <div className="flex-grow hidden justify-center px-6 mx-2 iphone_SE:flex">
                <SearchProposals
                  onChange={handleSearchChange}
                  onClick={getproposal}
                  width="100%"
                  bgColor="transparent"
                  placeholder="Search by proposal ID"
                  className="border-2 border-[#AAC8D6] w-full max-w-lg"
                />
              </div>
              <button
                className="bg-white text-[#05212C] flex items-center justify-between gap-3 lg:px-6 md:px-5 shadow-xl lg:py-3 py-2 px-4 rounded-full hover:bg-[#f0f4f7] transition-all duration-300 relative"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <div className="flex items-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1251 17.55H16.8751C17.0437 17.5497 17.2064 17.6125 17.3311 17.7262C17.4557 17.8398 17.5333 17.996 17.5486 18.164C17.5638 18.332 17.5156 18.4996 17.4134 18.6338C17.3113 18.768 17.1626 18.8591 16.9966 18.8892L16.8751 18.9H10.1251C9.9564 18.9003 9.79372 18.8375 9.66907 18.7238C9.54442 18.6102 9.46683 18.454 9.45159 18.286C9.43635 18.118 9.48456 17.9504 9.58672 17.8162C9.68888 17.682 9.83759 17.5909 10.0036 17.5608L10.1251 17.55ZM7.42507 12.15H19.5751C19.7438 12.1497 19.9064 12.2125 20.0311 12.3262C20.1557 12.4398 20.2333 12.596 20.2486 12.764C20.2638 12.932 20.2156 13.0996 20.1134 13.2338C20.0113 13.368 19.8626 13.4591 19.6966 13.4892L19.5751 13.5H7.42507C7.2564 13.5003 7.09371 13.4375 6.96907 13.3238C6.84442 13.2102 6.76683 13.054 6.75159 12.886C6.73635 12.718 6.78456 12.5504 6.88672 12.4162C6.98888 12.282 7.13759 12.1909 7.30357 12.1608L7.42507 12.15ZM4.72507 6.75H22.2751C22.4438 6.74969 22.6064 6.81255 22.7311 6.92619C22.8557 7.03983 22.9333 7.19602 22.9486 7.36401C22.9638 7.532 22.9156 7.6996 22.8134 7.83382C22.7113 7.96804 22.5626 8.05915 22.3966 8.0892L22.2751 8.1H4.72507C4.5564 8.10031 4.39371 8.03746 4.26907 7.92381C4.14442 7.81017 4.06683 7.65398 4.05159 7.48599C4.03635 7.318 4.08456 7.1504 4.18672 7.01618C4.28888 6.88196 4.43759 6.79085 4.60357 6.7608L4.72507 6.75Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <span className="text-[16px] ml-2 hidden md:flex">Filter</span>

                {showFilter && (
                  <div className="absolute bg-white border border-[#AAC8D6] rounded-lg shadow-lg mt-2 w-32 z-10 top-full md:left-0 left-[-48px]">
                    <div
                      className="cursor-pointer p-2 text-sm hover:bg-[#f0f4f7] rounded-t-lg"
                      onClick={() => setSortOrder('newest')}
                    >
                      Newest to Oldest
                    </div>
                    <div
                      className="cursor-pointer p-2 text-sm hover:bg-[#f0f4f7] rounded-b-lg"
                      onClick={() => setSortOrder('oldest')}
                    >
                      Oldest to Newest
                    </div>
                  </div>
                )}
              </button>

            </span>
          </div>
        )}
        <div className={`${showActions ? "w-full border-t py-6 border-[#0000004D] rounded-[10px] mb-4" : ""}`}>
          <div className="bg-transparent rounded flex flex-col gap-8">
            {displayedProposals.length === 0 ? (
              <p className="text-center font-black">
                <img src={nodata} alt="No Data" className="mx-auto block " />
                <p className="text-xl mt-5 font-bold">No Proposal Found!</p>
              </p>
            ) : (
              displayedProposals.map((proposal, index) => (
                <div className="desktop:mx-[-24px]" key={index}>
                  <Card key={index} proposal={proposal} voteApi={voteApi} isMember={isMember} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsContent;

export const SearchProposals = ({
  width,
  bgColor,
  placeholder,
  className,
  onChange,
  ...inputProps
}) => {
  return (
    <div
      className={`${className} flex items-center p-2 bg-${bgColor} rounded-full max-w-md mx-auto`}
      style={{ minWidth: width }}
    >
      <div className="mx-3">
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 25L19.2094 19.2094M19.2094 19.2094C20.1999 18.2189 20.9856 17.043 21.5217 15.7488C22.0577 14.4547 22.3336 13.0676 22.3336 11.6668C22.3336 10.266 22.0577 8.87896 21.5217 7.5848C20.9856 6.29065 20.1999 5.11475 19.2094 4.12424C18.2189 3.13373 17.043 2.34802 15.7488 1.81196C14.4547 1.27591 13.0676 1 11.6668 1C10.266 1 8.87896 1.27591 7.5848 1.81196C6.29065 2.34802 5.11474 3.13373 4.12424 4.12424C2.12382 6.12466 1 8.8378 1 11.6668C1 14.4958 2.12382 17.209 4.12424 19.2094C6.12466 21.2098 8.8378 22.3336 11.6668 22.3336C14.4958 22.3336 17.209 21.2098 19.2094 19.2094Z"
            stroke="#646464"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <input
        onChange={onChange}
        type="text"
        placeholder={placeholder}
        className="pl-4 pr-10 py-2 w-full bg-transparent focus:outline-none placeholder-zinc-400 text-zinc-700 placeholder-custom"
        {...inputProps}
      />
    </div>
  );
};
