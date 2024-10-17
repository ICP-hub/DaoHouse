import React, { useState, useEffect } from "react";
import { proposalsArray } from "../../Components/Proposals/proposalsData";
import Card from "../Proposals/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../../Components/utils/useAuthClient";
import { useParams } from "react-router-dom";
import nodata from "../../../assets/nodata.png";

const ProposalsContent = ({ proposals, isMember, showActions = true, voteApi, daoCanisterId }) => {
  const { backendActor, createDaoActor } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedProposals, setFetchedProposals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const proposalsPerPage = 4; 

  const allProposals = proposals && Array.isArray(proposals) ? proposals : [];

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Update getproposal to properly handle passed IDs
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

  const displayedProposals =
    searchTerm.trim() === "" ? allProposals : fetchedProposals;

  // Pagination logic
  const totalPages = Math.ceil(displayedProposals.length / proposalsPerPage);
  const indexOfLastProposal = currentPage * proposalsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - proposalsPerPage;
  const currentProposals = displayedProposals.slice(indexOfFirstProposal, indexOfLastProposal);

  // Handle next and previous pages
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-6 mb-6">
      {isMember && showActions && (
        <div className="flex items-center justify-between">
          <h1 className="lg:text-[24px] md:text-[18px] text-[16px] font-bold">
            Proposals
          </h1>
          <Link
            to={`/create-proposal/${daoCanisterId}`}
            className="flex justify-center items-center text-[16px] relative lg:w-[220px] lg:h-[50px] md:w-[185px] md:h-[46px] w-[30px] h-[30px] bg-white rounded-full"
            style={{
              boxShadow:
                "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
            }}
          >
            <span className="md:absolute md:text-[35px] text-[28px] font-thin lg:left-5 lg:bottom-[1px] md:left-4 md:bottom-[0.1%] md:mb-0 mb-[20%] ">
              +
            </span>
            <span className="ml-6 hidden md:block">Create Proposals</span>
          </Link>
        </div>
      )}
      <div className={`${showActions ? "bg-[#F4F2EC] pt-3 pb-8 mt-4 mb-8 rounded-[10px] " : ""} `}>
        {showActions && (
          <div className="flex justify-between items-center px-6 mb-3">
            <span className="text-[20px] text-[#05212C] font-semibold">All</span>
            <span className="flex">
              <div className="flex-grow flex justify-center px-6 mx-2">
                <SearchProposals
                  onChange={handleSearchChange} // Update search term on input change
                  onClick={getproposal} // Call getproposal on search
                  width="100%"
                  bgColor="transparent"
                  placeholder="Search by proposal ID"
                  className="border-2 border-[#AAC8D6] w-full max-w-lg"
                />
              </div>
            </span>
          </div>
        )}
        <div className={`${showActions ? "w-full border-t py-6 border-[#0000004D] rounded-[10px] mb-4" : ""}`}>
          <div className="bg-transparent rounded flex flex-col gap-8">
            {currentProposals.length === 0 ? (
              <p className="text-center font-black">
                <img src={nodata} alt="No Data" className="mx-auto block " />
                <p className="text-xl mt-5 font-bold">No Proposal Found!</p>
              </p>
            ) : (
              currentProposals.map((proposal, index) => (
                <div className="" key={index}>
                  <Card key={index} proposal={proposal} voteApi={voteApi} />
                </div>
              ))
            )}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="mr-2 p-2 border"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, pageNumber) => (
                <button
                  key={pageNumber + 1}
                  onClick={() => handlePageClick(pageNumber + 1)}
                  className={`p-2 border ${currentPage === pageNumber + 1 ? "bg-gray-300" : ""}`}
                >
                  {pageNumber + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="ml-2 p-2 border"
              >
                Next
              </button>
            </div>
          )}
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
