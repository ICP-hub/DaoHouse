import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdOutlineShortText } from "react-icons/md";

import allFeed from "../../Components/FeedPage/AllFeeds";
import latestFeed from "../../Components/FeedPage/LatestFeed";
import PostCard from "../../Components/FeedPage/PostCard";
import image from "../../../assets/bg_image.jpeg";

const FeedPage = () => {
  const [feed, setFeed] = useState(allFeed);
  const [active, setActive] = useState({ all: true, latest: false });
  const className = "FeedPage";

  const setAllActive = () => {
    setFeed(allFeed);
    setActive({ all: true, latest: false });
  };

  const setLatestActive = () => {
    setFeed(latestFeed);
    setActive({ all: false, latest: true });
  };

  return (
    <div className={className + " " + "w-full"}>
      <div
        className={
          className +
          "__filter w-100 h-[15vh] p-20 flex flex-col items-start justify-center"
        }
        style={{
          backgroundImage: `url("${image}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-3xl border-b-2 border-white p-3 text-white">
          Social Feed
        </h1>

        <div className={className + "__buttons flex flex-row"}>
          <button
            className={`px-6 py-2 text-lg ${
              !active.all ? "text-slate-500" : "text-white"
            }`}
            onClick={setAllActive}
          >
            All
          </button>
          <button
            className={`px-6 py-2 text-lg ${
              !active.latest ? "text-slate-500" : "text-white"
            }`}
            onClick={setLatestActive}
          >
            Latest
          </button>
        </div>
      </div>

      <div
        className={
          className +
          "__label bg-[#c8ced3] py-8 px-10 flex flex-row w-full justify-between items-center"
        }
      >
        <p className="text-4xl px-8 flex flex-row items-center gap-2">
          {active.all ? "All" : "Latest"} <MdOutlineShortText />
        </p>

        <button className="flex flex-row items-center px-6 py-3 gap-2 rounded-[2rem] bg-white text-base">
          <HiPlus />
          Create Post
        </button>
      </div>

      <div
        className={
          className + "__postCards px-10 pb-10 bg-[#c8ced3] gap-8 flex flex-col"
        }
      >
        {feed && feed.map((post, i) => <PostCard post={post} key={i} />)}
      </div>
    </div>
  );
};

export default FeedPage;
