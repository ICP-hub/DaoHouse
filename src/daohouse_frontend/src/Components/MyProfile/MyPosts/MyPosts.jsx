import React, { useEffect, useState } from "react";
import { usePostContext } from "../../../PostProvider";
import NoDataComponent from "../../Dao/NoDataComponent";
import { useAuth } from "../../utils/useAuthClient";
import MuiSkeleton from "../../SkeletonLoaders/MuiSkeleton";
import Card from "../../Proposals/Card";
import SearchProposals from "../../Proposals/SearchProposals";

const MyPosts = () => {
  const { backendActor } = useAuth();
  const { setSelectedPost } = usePostContext();
  const [myProposals, setMyProposals] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term
  const [proposals, setProposals] = useState([]); // Added state for proposals
  const className = "MyPosts";

  const itemsPerPage = 4;

  const getPosts = async () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const paginationPayload = {
      start,
      end,
    };

    try {
      setLoading(true);
      let res;
      if (searchTerm.trim() === "") {
        res = await backendActor.get_my_proposals(paginationPayload);
      } else {
        res = await backendActor.search_proposals(searchTerm.trim());
      }

      const dataLength = res.length || 0;
      setTotalItems(Math.ceil(dataLength / itemsPerPage));
      setMyProposals(res.slice(start, end)); // Slice proposals for pagination
    } catch (error) {
      console.log("Error fetching proposals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={className}>
      <div className="mt-5 md:mt-10">
        <div className="flex gap-10">
        <h3 className="text-[#05212C] md:text-[24px] text-[18px] md:font-bold font-mulish self-center">
          Submitted Proposals
        </h3>
        <div className="  flex-grow lg:flex justify-end hidden">
          <SearchProposals
            onChange={handleSearchChange}
            value={searchTerm}
            width="60%"
            bgColor="transparent"
            placeholder="Search by proposal ID"
            className="border-2 border-[#AAC8D6] w-full md:max-w-lg "
          />
        </div>
        </div>
        {loading ? (
          <MuiSkeleton />
        ) : myProposals.length === 0 ? (
          <div className="mt-4 md:mt-8 w-full">
            <NoDataComponent />
          </div>
        ) : (
          <div
            className="flex flex-col md:mt-4 mt-2 mb-6 bg-[#F4F2EC] p-2 rounded-lg gap-2 h-auto md:h-73 w-full  overflow-y-auto"
            style={{ maxHeight: "535px" }}
          >
            {myProposals.map((proposal, index) => (
              <div key={index} className="proposal relative w-full">
               <Card proposal={proposal} isSubmittedProposals={true} showComments={true}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
