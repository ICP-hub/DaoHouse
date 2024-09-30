import React, { useEffect, useState } from "react";
import { usePostContext } from "../../../PostProvider";
import NoPostProfile from "../../Dao/NoPostProfile";
import NoDataComponent from "../../Dao/NoDataComponent"; // Import NoDataComponent
import { useAuth } from "../../utils/useAuthClient";
import Pagination from "../../pagignation/Pagignation";
import MuiSkeleton from "../../SkeletonLoaders/MuiSkeleton";
import Card from "../../Proposals/Card";

const MyPosts = () => {
  const { backendActor } = useAuth();
  const { setSelectedPost } = usePostContext();
  const [myProposals, setMyProposals] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const className = "MyPosts";

  const getPosts = async () => {
    const itemsPerPage = 4;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginationPayload = {
      start,
      end,
    };

    try {
      setLoading(true);
      const res = await backendActor.get_my_proposals(paginationPayload);
      console.log("---res--", res);
      const dataLength = res.length || 0;
      setTotalItems(Math.ceil(dataLength / itemsPerPage));
      setMyProposals(res);
    } catch (error) {
      console.log("Error fetching proposals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [currentPage]);

  return (
    <div className={className}>
      <div className="md:ml-10 mx-5 mt-5">
        <h3 className="text-[#05212C] md:text-[24px] text-[18px] md:font-bold font-semibold ml-4 translate-y-[-65px]">
          Submitted Proposals
        </h3>
        {loading ? (
          <MuiSkeleton />
        ) : myProposals.length === 0 ? ( // Check if there are no proposals
          <div className="translate-y-[52px]"> {/* New class for translate-y */}
          <NoDataComponent /> {/* Display NoDataComponent when there are no proposals */}
        </div>
        ) : (
          <div className="flex flex-col md:mt-4 mt-2 mb-6 bg-[#F4F2EC] p-2 rounded-lg gap-2 h-64 w-[1100px]">
            {myProposals.map((proposal, index) => (
              <div key={index} className="proposal relative w-full">
                <Card proposal={proposal} isSubmittedProposals={true} />
              </div>
            ))}
          </div>
        )}
        {myProposals.length > 0 && ( // Show pagination only if there are proposals
          <Pagination
            costomClass={"mt-10"}
            totalItems={totalItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default MyPosts;
