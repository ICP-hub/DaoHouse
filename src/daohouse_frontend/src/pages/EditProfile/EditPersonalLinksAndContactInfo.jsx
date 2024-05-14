import React from "react";

const EditPersonalLinksAndContactInfo = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4 flex flex-col">
        {/* Contact No. */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="contactNo"
            className="block text-[16px] font-semibold text-[#05212C] mr-2 w-[100px]"
          >
            Contact No.
          </label>
          <div className="flex-grow">
            <input
              id="contactNo"
              type="tel"
              placeholder="0123456789"
              className="py-2 px-3 ml-16 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm box-border"
            />
            <button className="ml-20 px-10 py-2 bg-[#0E3746] text-white text-[14px] rounded-[27px] transition duration-200 ease-in-out hover:bg-[#0E37464D] box-border">
              Update
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="email"
            className="block text-[16px] font-semibold text-[#05212C] mr-2 w-[100px]"
          >
            Email
          </label>
          <div className="flex-grow">
            <input
              id="email"
              type="email"
              placeholder="Emailid.id@example.com"
              className="py-2 px-3 ml-16 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm box-border"
            />
            <button className="ml-20 px-10 py-2 bg-[#0E3746] text-white text-[14px] rounded-[27px] transition duration-200 ease-in-out hover:bg-[#0E37464D] box-border">
              Update
            </button>
          </div>
        </div>

        {/* Twitter */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="twitter"
            className="block text-[16px] font-semibold text-[#05212C] mr-2 w-[100px]"
          >
            Twitter
          </label>
          <div className="flex-grow">
            <input
              id="twitter"
              type="url"
              placeholder="http://www.example.com"
              className="py-2 px-3 ml-16 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm box-border"
            />
            <button className="ml-20 px-10 py-2 bg-[#0E3746] text-white text-[14px] rounded-[27px] transition duration-200 ease-in-out hover:bg-[#0E37464D] box-border">
              Update
            </button>
          </div>
        </div>

        {/* Telegram */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="telegram"
            className="block text-[16px] font-semibold text-[#05212C] mr-2 w-[100px]"
          >
            Telegram
          </label>
          <div className="flex-grow">
            <input
              id="telegram"
              type="url"
              placeholder="http://www.example.com"
              className="py-2 px-3 ml-16 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm box-border"
            />
            <button className="ml-20 px-10 py-2 bg-[#0E3746] text-white text-[14px] rounded-[27px] transition duration-200 ease-in-out hover:bg-[#0E37464D] box-border">
              Update
            </button>
          </div>
        </div>

        {/* Website */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="website"
            className="block text-[16px] font-semibold text-[#05212C] mr-2 w-[100px]"
          >
            Website
          </label>
          <div className="flex-grow">
            <input
              id="website"
              type="url"
              placeholder="http://www.example.com"
              className="py-2 px-3 ml-16 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm box-border"
            />
            <button className="ml-20 px-10 py-2 bg-[#0E3746] text-white text-[14px] rounded-[27px] transition duration-200 ease-in-out hover:bg-[#0E37464D] box-border">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPersonalLinksAndContactInfo;
