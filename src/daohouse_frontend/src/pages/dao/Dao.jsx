import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import DaoCard from "../../Components/Dao/DaoCard";
import NoDataComponent from "../../Components/Dao/NoDataComponent";
import TopComponent from "../../Components/Dao/TopComponent";
import Container from "../../Components/Container/Container";
import SearchProposals from "../../Components/Proposals/SearchProposals";
import { DiBlackberry } from "react-icons/di";
import { useAuth } from "../../Components/utils/useAuthClient";
import { Actor, HttpAgent } from '@dfinity/agent';
import MuiSkeleton from "../../Components/Skeleton/MuiSkeleton";
import { idlFactory as myCanisterIdl, canisterId as myCanisterId } from '../../../../declarations/dao_canister/index';
const agent = new HttpAgent();
const Dao = () => {
  const [showAll, setShowAll] = useState(true);
  const [joinedDAO, setJoinedDAO] = useState(false);
  const className = "DAO";
  const { backendActor, createActor, createDaoActor } = useAuth();
  const [dao, setDao] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("--dao--", dao);

  const joinedDAOs = [
    { name: "DAO 3", funds: "155m USD", members: 40, groups: 4, proposals: 10 },
    { name: "DAO 3", funds: "160m USD", members: 35, groups: 6, proposals: 18 },
  ];

  const getDaos = async () => {
    const pagination = {
      start: 0,
      end: 10,
    };
    try {
      setLoading(true);
      let response = await backendActor.get_all_dao(pagination);

 
// =======
// >>>>>>> main
      console.log(response, 'response');
      let allDaoDetails = [];
      await Promise.all(response.map(async (data) => {
        console.log(data.dao_canister_id, "canister id");

        const daoCanister = createDaoActor(data.dao_canister_id);
        console.log(daoCanister, "dao hao ye");

        const dao_details = await daoCanister.get_dao_detail();
        console.log(dao_details, "details aa gye bhaiii");

        allDaoDetails.push(dao_details);
      }));
      const combinedDaoDetails = allDaoDetails.flat();
      console.log("--combinedDaoDetails", combinedDaoDetails);
      setDao(combinedDaoDetails)
    } catch (error) {

      // =======
      //       console.log(response,'response')
      //           response.map(async (data) => {
      //             const daoCanister = createDaoActor(data.dao_canister_id)
      //             const dao_details = await  daoCanister.get_dao_detail()
      //             console.log(dao_details, "details aa gye bhaiii")
      //         })
      //       } catch (error) {
      // >>>>>>> main
// =======

// >>>>>>> main
      console.error('Error fetching DAOs:', error);
    }
    finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    getDaos();
  }, [backendActor]);

  return (
    <div className="bg-zinc-200">
      <TopComponent showAll={showAll} setShowAll={setShowAll} showButtons={true} />
      <div className={"bg-[#c8ced3]"}>
        <Container classes={`__label small_phone:py-8 py-5 mobile:px-10 px-5 flex flex-row w-full justify-between items-center ${className}`}>
          <div onClick={() => getDaos()} className="small_phone:text-4xl text-3xl big_phone:px-8 flex flex-row items-center gap-4">
            {showAll ? "All" : "Joined"}
            <div className="flex flex-col items-start">
              <div className="mobile:w-32 w-12 border-t-2 border-black"></div>
              <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
            </div>
          </div>
          <div className="flex-grow lg:flex justify-center px-6 mx-2 hidden">
            <SearchProposals
              width="100%"
              bgColor="transparent"
              placeholder="Search here"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
            />
          </div>
          <Link to="/dao/create-dao">
            <button className="bg-white small_phone:gap-2 gap-1 mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition">
              <HiPlus />
              Create DAO
            </button>
          </Link>
          <style>
            {`
          .placeholder-custom::placeholder {
            color: black;
            font-weight: bold;
            borderText:black;
          }`}
          </style>
        </Container>
      </div>
      {showAll ? (
        loading ? (
          <div className="flex justify-center items-center h-full">
            <MuiSkeleton />
          </div>
        ) : dao && dao.length > 0 ? (
          <div className={"bg-[#c8ced3]"}>
            <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4 ${className}`}>
              {
                dao.map((daos, index) => (
                  <DaoCard
                    key={index}
                    name={daos.dao_name || 'No Name'}
                    funds={daos.funds ? daos.funds.toString() : '0'}
                    members={daos.members_count ? Number(BigInt(daos.members_count)) : '0'}
                    groups={daos.groups_count ? Number(BigInt(daos.groups_count)) : 'No Groups'}
                    proposals={Array.isArray(daos.proposals) ? daos.proposals.join(', ') : '0'}
                    image_id={daos.image_id || 'No Image'}
                  />
                ))}
            </Container>
          </div>
        ) : (
          <NoDataComponent />
        )
      ) : joinedDAO && joinedDAO.length > 0 ? (
        <div className={"bg-[#c8ced3]"}>
          <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4 ${className}`}>
            {joinedDAO.map((a, index) => (
              <DaoCard
                key={index}
                name={a.name}
                funds={a.funds}
                members={a.members}
                groups={a.groups}
                proposals={a.proposals}
              />
            ))}
          </Container>
        </div>
      ) : (
        <NoDataComponent />
      )}
    </div>

  );
};

export default Dao;



