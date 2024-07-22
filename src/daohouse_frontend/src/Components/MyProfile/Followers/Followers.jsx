import React, { useState ,useEffect} from "react";
import { RxArrowTopRight } from "react-icons/rx";
import follower from "../../../../assets/followerImage.png";
import { useAuth } from "../../utils/useAuthClient";
import MuiSkeleton from "../../Skeleton/MuiSkeleton";

const Followers = () => {
  const { backendActor, frontendCanisterId, identity } = useAuth();
  const className = "Followers";
  const[loading,setLoading] = useState(false);
 //Api integration
 const[data,setdata] = useState({});
 console.log("--followers detail-",data);
 const getdata = async () => {
  try {
    setLoading(true);
    const response = await backendActor.get_user_profile();
    setdata(response.Ok || {})
  } catch (error) {
    console.error("Error :", error);
  }
  finally{
    setLoading(false)
  }
}

useEffect(() => {
  getdata();

}, [backendActor]);

  return (
    <div className={className + " " + "w-full"}>
    <div className="lg:ml-10 tablet:mt-12 mt-5 md:px-0 px-3">
      <h3 className="text-[#05212C] tablet:text-[24px] text-[18px] tablet:font-bold font-semibold mb-4">
        Followers
      </h3>
      {loading ? (
        <MuiSkeleton />
      ) : (
        <div className="flex gap-5">
          <div className="flex flex-1 flex-col gap-4 bg-[#F4F2EC] p-4 rounded-[10px] overflow-y-auto max-h-[300px]">
            {followersList.map(({ userName, key, image }) => (
              <div
                key={key}
                className="w-full flex flex-row items-center justify-between"
              >
                <div className="flex flex-row tablet:gap-4 gap-2 items-center">
                  <section className="border border-cyan-200 rounded-[50%]">
                    <img
                      src={image}
                      alt="Follower"
                      className="tablet:min-w-12 min-w-8 h-full object-contain border border-4 border-white rounded-[50%]"
                    />
                  </section>
  
                  <section className="flex flex-col items-start">
                    <p className="tablet:text-lg text-sm">{userName}</p>
                    <p className="text-slate-500 tablet:text-sm text-xs">
                      {userName}
                    </p>
                  </section>
                </div>
  
                <button className="border border-cyan-500 tablet:px-4 px-2 py-1 tablet:text-sm text-xs rounded-2xl text-cyan-500">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="w-[40%] p-3 bg-[#F4F2EC] rounded-[10px] overflow-y-auto max-h-[300px] hidden md:block">
            <h1 className="text-[#05212C] text-[20px] font-bold">More People</h1>
            <div className="w-full bg-[#0000004D] h-[1px] my-3"></div>
            <div>
              {morePeopleList.map(({ userName, image, gmail, key }) => (
                <div
                  key={key}
                  className="flex justify-between items-center mb-4"
                >
                  <span className="flex gap-4">
                    <img
                      src={image}
                      alt="Follower"
                      className="tablet:w-10 w-8 object-contain rounded-[50%]"
                    />
                    <span>
                      <p className="tablet:text-1xl text-sm">{userName}</p>
                      <p className="text-slate-500 tablet:text-xs text-xs">
                        {gmail}
                      </p>
                    </span>
                  </span>
                  <RxArrowTopRight className="tablet:text-2xl text-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 md:hidden">
        <h1 className="text-[#05212C] text-[16px] font-bold ml-2">More People</h1>
        <div className="w-full bg-[#0000004D] h-[2px] mb-4 mt-2"></div>
        <div className="flex gap-3 overflow-x-auto max-w-full">
          {morePeopleList.map(({ userName, image, gmail, key }) => (
            <div
              key={key}
              className="flex flex-col justify-between items-center mb-4 bg-[#FFFFFF] py-4 px-6 rounded-[10px]"
            >
              <img
                src={image}
                alt="Follower"
                className="tablet:w-10 w-8 object-contain rounded-[50%]"
              />
              <p className="tablet:text-1xl text-sm">{userName}</p>
              <p className="text-slate-500 tablet:text-xs text-xs">{gmail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Followers;

const followersList = [
  {
    key: 1,
    userName: "Username.user",
    image: follower,
  },
  {
    key: 2,
    userName: "Username.user",
    image: follower,
  },
  {
    key: 3,
    userName: "Username.user",
    image: follower,
  },
  {
    key: 4,
    userName: "Username.user",
    image: follower,
  },
];

const morePeopleList = [
  {
    key: 1,
    image: follower,
    userName: "Kai Parker",
    gmail: "Gmail@gmail.com",
  },
  {
    key: 2,
    image: follower,
    userName: "Kai Parker",
    gmail: "Gmail@gmail.com",
  },
  {
    key: 3,
    image: follower,
    userName: "Kai Parker",
    gmail: "Gmail@gmail.com",
  },
  {
    key: 4,
    image: follower,
    userName: "Kai Parker",
    gmail: "Gmail@gmail.com",
  },
  {
    key: 5,
    image: follower,
    userName: "Kai Parker",
    gmail: "Gmail@gmail.com",
  },
];
