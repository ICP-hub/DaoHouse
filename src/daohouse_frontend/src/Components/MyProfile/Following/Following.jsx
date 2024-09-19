import React, { useState, useEffect } from "react";
import { RxArrowTopRight } from "react-icons/rx";
import MuiSkeleton from "../../Skeleton/MuiSkeleton";
import { useAuth } from "../../utils/useAuthClient";
import Avatar from "../../../../assets/Avatar.png"

const Following = () => {
  const className = "Following";
  const { backendActor, frontendCanisterId, identity } = useAuth();
  const [data, setdata] = useState([])
  const [loading, setLoading] = useState(false);

  const getdata = async () => {
    try {
      setLoading(true);
      const response = await backendActor.get_my_following();
      console.log("following api:", response);
      if (Array.isArray(response.Ok)) {
        setdata(response.Ok);
      } else {
        setdata([]);
      }
    } catch (error) {
      console.error("Error :", error);
      setdata([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getdata();

  }, [backendActor]);

  return (
    <div className={className + " " + "w-full"}>
      <div className="lg:ml-10 tablet:mt-12 mt-5 md:px-0 px-3">
        <h3 className="text-[#05212C] tablet:text-[24px] text-[18px] translate-x-[12px] translate-y-[-90px] tablet:font-bold font-semibold mb-4">
          Dao Joined
        </h3>
        {loading ? (
          <MuiSkeleton />
        ) :
          data.length === 0 ? (
            <p className=" text-black mt-10 "></p>
          ) :
            (
              <>
                <div className="flex gap-5 md:w-[50%]">
                  <div className="flex flex-1 flex-col gap-4 bg-[#F4F2EC] p-4 rounded-[10px] overflow-y-auto max-h-[300px]">
                    {data.map((principal, index) => (
                      <div
                        key={index}
                        className="w-full flex flex-row items-center justify-between"
                      >
                        <div className="flex flex-row tablet:gap-4 gap-2 items-center">
                          <section className="border border-cyan-200 rounded-[50%]">
                            <img
                              src={Avatar}
                              alt="Following"
                              className="tablet:w-16 w-16 h-full object-contain border-4 border-white rounded-[50%]"
                            />
                          </section>

                          <section className="flex flex-col items-start">
                            <p className="tablet:text-lg text-sm truncate ... w-40 lg:w-80">
                              {principal.toString()}
                            </p>
                            <p className="text-slate-500 tablet:text-sm text-xs truncate ... lg:w-80 w-40">
                              {principal.toString()}
                            </p>
                          </section>
                        </div>

                        {/* <button className="border border-cyan-500 tablet:px-4 px-2 py-1 tablet:text-sm text-xs rounded-2xl text-cyan-500">
                    Remove
                  </button> */}
                      </div>
                    ))}
                  </div>
                  {/* <div className="w-[40%] p-3 bg-[#F4F2EC] rounded-[10px] overflow-y-auto max-h-[300px] hidden md:block">
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
            </div> */}
                </div>
                {/* <div className="mt-4 md:hidden">
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
          </div> */}
              </>
            )}
      </div>
    </div>

  );
};

export default Following;