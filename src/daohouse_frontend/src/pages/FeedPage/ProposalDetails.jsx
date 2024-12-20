import React, { useEffect, useMemo, useState } from "react";
import "../DaoProfile/DaoProfile.scss";
import {  useParams } from "react-router-dom";
import Container from "../../Components/Container/Container";
import { Principal } from '@dfinity/principal';
import { useAuth } from "../../Components/utils/useAuthClient";
import toast from 'react-hot-toast';
import Card from "../../Components/Proposals/Card";
import Comments from "../Post/Comments";
import ProposalDetailsLoaderSkeleton from "../../Components/SkeletonLoaders/ProposalLoaderSkeleton/ProposalDetailsLoaderSkeleton";
import NoDataComponent from "../../Components/Dao/NoDataComponent";
import { CircularProgress } from "@mui/material";
import messagesound from "../../Sound/messagesound.mp3";import daoImage from "../../../assets/daoImage.png"
import ShowModal from "../../Components/DaoProfile/ShowModal";

const ProposalsDetails = () => {
   const className="DaoProfile"
  const { backendActor, createDaoActor } = useAuth();
  const [dao, setDao] = useState(null);
  const { proposalId, daoCanisterId } = useParams();
  const [proposal, setProposal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinStatus, setJoinStatus] = useState("Join DAO");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingJoinedDAO, setLoadingJoinedDAO] = useState(false); 
  const [isComment, setIsComment] = useState(true);
  const [commentCount, setCommentCount] = useState(0); 
  const [isRequested, setIsRequested] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null)

  const maxWords = 90;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const truncateText = (text, wordLimit) => {
    const words = text.split('');
    if (words.length > wordLimit) {
      return {
        truncated: words.slice(0, wordLimit).join('') + '...',
        isTruncated: true,
      };
    }
    return {
      truncated: text,
      isTruncated: false,
    };
  };

  const { truncated, isTruncated } = truncateText(dao?.purpose || 'Dao Purpose', maxWords);

  const daoActor = useMemo(() => {
    return daoCanisterId ? createDaoActor(daoCanisterId) : null;
  }, [daoCanisterId, createDaoActor]);


  useEffect(() => {
    const fetchDaoDetails = async () => {
      setLoading(true);
      if (daoCanisterId) {
        try {
          const proposalDetails = await daoActor.get_proposal_by_id(proposalId);
          setProposal(proposalDetails);          
          setCommentCount(Number(BigInt(proposalDetails?.comments || 0)))

          const daoDetails = await daoActor.get_dao_detail();
          setDao(daoDetails);
          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
          const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());
          setCurrentUserId(currentUserId)
          const daoMembers = daoDetails?.all_dao_user || [];
          const requestedToJoin = daoDetails?.requested_dao_user || []; 
          const isUserRequested =
              Array.isArray(requestedToJoin) &&
              requestedToJoin.some(
                (member) => member.toString() === currentUserId.toString()
              );
            setIsRequested(isUserRequested);        
          const isCurrentUserMember = daoMembers.some(member => member.toString() === currentUserId.toString());
          if (isCurrentUserMember) {

            setIsMember(true);

            setJoinStatus("Joined");
          } else if (isUserRequested) {
            setJoinStatus("Requested");
          } else {
            setIsRequested(false);
        
            setJoinStatus("Join DAO");
          }
          }
          setLoading(false)
        } catch (error) {
          console.error('Error fetching DAO details:', error);
        } 
      }
    };

    fetchDaoDetails();
  }, [daoActor, backendActor, proposalId]);

  const handleJoinDao = async () => {
    if (joinStatus === 'Joined') {
      toast.error(`You are already member of this dao`);
      return;
    };

    setShowConfirmModal(true);
    
  };

  const confirmJoinDao = async () => {
    setLoadingJoinedDAO(true)
    try {
      const place_to_join = "General Members";

      const joinDaoPayload = {
        place_to_join: place_to_join,
      };

      const response = await daoActor.ask_to_join_dao(joinDaoPayload);
      const sound = new Audio(messagesound);

      if (response.Ok) {
        toast.success(response.Ok);
        sound.play();
        const daoDetails = await daoActor.get_dao_detail();    
            const daoMembers = daoDetails.all_dao_user;
            const requestedToJoin = daoDetails.requested_dao_user;
    
            const isCurrentUserMember = daoMembers.some(
              (member) => member.toString() === currentUserId.toString()
            );
            const isUserRequested = requestedToJoin.some(
              (member) => member.toString() === currentUserId.toString()
            );
            setIsRequested(isUserRequested);
        setIsMember(isCurrentUserMember);
        if (isCurrentUserMember) {
          setJoinStatus("Joined");
        } else if (isUserRequested) {
          setJoinStatus("Requested");
        } else {
          setIsRequested(false);
          setIsMember(false);
          setJoinStatus("Join DAO");
        }
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      setLoadingJoinedDAO(false);
      console.error("Error sending join request:", error);
      toast.error(error);
    } finally {
      setShowConfirmModal(false);
      setLoadingJoinedDAO(false);
    }
  };


  const getImageUrl = (imageId) => {
    return `${process.env.DFX_NETWORK === "ic" ? "https" : "http"}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943"}/f/${imageId}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} className="mt-12 mb-28">
        <ProposalDetailsLoaderSkeleton isProposalDetails={true} showActions={true} />
      </div>
    );
  }

  if (!dao) {
    return <div className="m-auto mt-20"><NoDataComponent /></div>;
  }

  return (
    <div className={`${className} bg-zinc-200 w-full relative`}>
  <Container classes="${className} __mainComponent lg:py-8 lg:pb-20 py-6 big_phone:px-8 px-6 tablet:flex-row gap-2 flex-col w-full md:pl-2">
    <div className="w-full md:gap-2 gap-10 z-10 relative md:pl-4 tablet:px-12 lg:px-16 mt-10">
      <div className="flex flex-col md:flex-row md:justify-between md:pl-1">
        {/* Left Side: Proposal Details */}
        <div className="flex flex-col mobile:flex-row items-center gap-4 flex-grow">
          <div
            className="w-full mobile:w-[145px] h-[200px] lg:w-[207px] lg:h-[120px] bg-[#C2C2C2] mobile:h-[84px] rounded overflow-hidden flex-shrink-0 self-start"
            style={{
              boxShadow:
                "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
            }}
          >
            <img
              className="w-full h-full object-cover"
              src={dao?.image_id ? getImageUrl(dao?.image_id) : daoImage}
              alt="profile-pic"
            />
          </div>

          <div className=" md:mt-0 mt-4 w-full">
            
            <div className='flex items-center justify-between w-full'>
            <h2 className="lg:text-[40px] md:text-[24px] text-[16px] tablet:font-normal font-medium  text-[#05212C] mobile:text-start text-start">
            {dao?.dao_name || 'Dao Name'}
            </h2>
            <button
            onClick={handleJoinDao}
            disabled={joinStatus=="Joined" || isRequested}
            className={`bg-white text-[16px] text-[#05212C] shadow-xl px-5 py-1 rounded-[27px]  lg:h-[40px]  md:h-[40px]  flex items-center justify-center ${joinStatus=="Joined" || isRequested
              ? "cursor-not-allowed cursor"
              : "cursor-pointer"}`}
            
            style={{
              whiteSpace: "nowrap",
              boxShadow:
                "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
            }}
          >
            {joinStatus}
          </button>
            </div>
            <div className="relative w-full mt-2">
              <p className="text-[12px] tablet:text-[16px] font-normal md:text-left text-[#646464] break-words text-start">
                {isExpanded ? dao?.purpose : truncated}
                {isTruncated && (
                  <button
                    onClick={toggleExpanded}
                    className="text-[#0E3746] text-[12px] tablet:text-[16px] underline"
                  >
                    {isExpanded ? 'See less' : 'See more'}
                  </button>
                )}
              </p>
            </div>

           
          </div>
        </div>

        {/* Right Side: Follow & Join Buttons */}
        <div className="flex justify-center gap-4 mt-4 md:mt-0  self-center md:self-start">
         {showConfirmModal && (
                 <ShowModal  showConfirmModal={showConfirmModal} confirmJoinDao={confirmJoinDao} 
                 setShowConfirmModal={setShowConfirmModal} loading={loadingJoinedDAO} />
                )}
        </div>
      </div>
    </div>

    {/* Comments and Proposal Details */}
    <div className="mt-12">
      <div className="px-0 tablet:px-0">
      <Card
        proposal={proposal}
        showActions={true}
        isProposalDetails={true}
        voteApi={daoActor}
        isComment={isComment}
        setIsComment={setIsComment}
        commentCount={commentCount}
        showComments={true}
        isMember={isMember}
      />
      </div>
      {isComment && (
        <div className="tablet:px-12">
          <Comments
          daoId={daoCanisterId}
          proposalId={proposalId}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />
        </div>
      )}
    </div>
  </Container>
</div>

  );
};

export default ProposalsDetails;
