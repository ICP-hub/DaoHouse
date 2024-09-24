import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaTelegramPlane } from "react-icons/fa";
import { BiSolidCommentDetail } from "react-icons/bi";
import { usePostContext } from "../../../PostProvider";
import NoPostProfile from "../../Dao/NoPostProfile";
import { useAuth } from "../../utils/useAuthClient";
import Pagination from "../../pagignation/Pagignation";
import MuiSkeleton from "../../SkeletonLoaders/MuiSkeleton";
import Card from "../../Proposals/Card";

const MyPosts = () => {
  const { backendActor } = useAuth();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [readMoreIndex, setReadMoreIndex] = useState(null);
  const { setSelectedPost } = usePostContext();
  const [myProposals, setMyProposals] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const className = "MyPosts";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [loading, setLoading] = useState(false);

  console.log(backendActor);
  

  const getpost = async () => {
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
      setTotalItems(Math.ceil(dataLength / 4));
      setMyProposals(res);
    } catch (error) {
      console.log("error fetching proposal", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getpost();
  }, [currentPage]);

  return (
    <div className={className}>
      <div className="md:ml-10 mx-5 mt-5">
        <h3 className="text-[#05212C] md:text-[24px] text-[18px] md:font-bold font-semibold ml-4 translate-y-[-70px]" onClick={getpost}>
          Submitted Proposals
        </h3>
        {loading ? (
          <MuiSkeleton />
        ) : myProposals?.length === 0 ? (
          <NoPostProfile />
        ) : (
          <div className="grid grid-cols-2 md:mt-4 mt-2 mb-6 bg-[#F4F2EC] p-2 rounded-lg gap-2 h-64">
            {myProposals?.map((proposal, index) => (
              <div
                key={index}
                className="proposal relative w-full"
              >
                <Card proposal={proposal} />
              </div>
            ))}
          </div>
        )}
        {myProposals?.length > 0 && (
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