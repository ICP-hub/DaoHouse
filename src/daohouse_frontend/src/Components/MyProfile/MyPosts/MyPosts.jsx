import React, { useEffect, useState } from "react";
import { usePostContext } from "../../../PostProvider";
import NoPostProfile from "../../Dao/NoPostProfile";
import { useAuth } from "../../utils/useAuthClient";
import Pagination from "../../pagignation/Pagignation";
import MuiSkeleton from "../../Skeleton/MuiSkeleton";
import Card from "../../../Components/Proposals/Card";

const MyPosts = () => {
  const { backendActor } = useAuth();
  const { setSelectedPost } = usePostContext();
  const [myProposals, setMyProposals] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    const itemsPerPage = 4;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    try {
      setLoading(true);
      const res = await backendActor.get_my_proposals({ start, end });
      
      console.log("data1",res)
      const dataLength = res.length || 0;
      setTotalItems(Math.ceil(dataLength / itemsPerPage));
      setMyProposals(res);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [currentPage]);

  return (
    <div className="MyPosts md:ml-10 mx-5 mt-5">
      <h3 className="text-[#05212C] md:text-[24px] text-[18px] md:font-bold font-semibold ml-4">
        Submitted Proposals
      </h3>
      {loading ? (
        <MuiSkeleton />
      ) : myProposals.length === 0 ? (
        <NoPostProfile />
      ) : (
        <div className="grid grid-cols-2 md:mt-4 mt-2 mb-6 bg-[#F4F2EC] p-2 rounded-lg gap-2 h-64">
          {myProposals.map((proposal, index) => (
            <div key={index} className="proposal relative w-full">
              <Card proposal={proposal} />
            </div>
          ))}
        </div>
      )}
      {myProposals.length > 0 && (
        <Pagination
          costomClass={"mt-10"}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MyPosts;
