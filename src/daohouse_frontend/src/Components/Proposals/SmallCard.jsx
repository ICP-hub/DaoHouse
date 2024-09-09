import React from "react";

const SmallCard = ({ title, input1, input2 }) => {
  return (
    <div className="w-[300px] bg-white border-2 border-[#ABABAB] rounded-xl shadow-sm m-2">
      <div className="flex items-center">
        <h2 className="text-[14px] font-semibold text-black my-2 px-2">
          {title}
        </h2>
      </div>
      <div className="border-b border-[#ABABAB]"></div>
      <div className="flex justify-between gap-4 items-center px-2 mb-4 mt-2">
        <div className="w-full flex items-center gap-4 justify-start">
          <div className="flex-1 justify-center items-center text-center ;">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-black whitespace-nowrap"
            >
              {input1}
            </label>
            <input
              type="radio"
              id="amount"
              name="amount"
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter amount"
            />
          </div>

          <div className="flex-1 justify-center items-center text-center">
            <label
              htmlFor="receiver"
              className="block text-sm font-medium text-black whitespace-nowrap"
            >
              {input2}
            </label>

            <input
              type="radio"
              id="receiver"
              name="receiver"
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter receiver's details"
            />
          </div>
        </div>
        <div>
          <button
            className={`bg-[#0E3746] px-6 py-1 text-sm text-white rounded-full ${
              title === "Cast Vote" ? "block" : "hidden"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
