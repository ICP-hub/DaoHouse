import React from "react";

const EditPersonalLinksAndContactInfo = ({
  profileData,
  handleInputChange,
  handleSaveChangesClick,
  errors,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4 flex flex-col">
        {/* Contact Number */}
        <div className="flex flex-col mb-4">
          <div className="flex items-center">
            <label
              htmlFor="contactNo"
              className="block md:text-[16px] text-[12px] font-semibold text-[#05212C] md:w-[100px] w-[70px]"
            >
              Contact No.<span className="text-red-500">*</span>
            </label>
            <div className="flex-grow ml-20">
              <input
                id="contact_number"
                name="contact_number"
                type="number" 
                value={profileData.contact_number}
                onChange={handleInputChange}
                placeholder="0123456789"
                pattern="[0-9]{10,16}"
                className="py-2 px-3 w-full md:w-full lg:w-[50%] border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm text-[12px]"
              />
            </div>
          </div>
          {errors.contact_number && (
            <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>
          )}
          {profileData.contact_number && String(profileData.contact_number.length < 10 || profileData.contact_number.length > 16) && (
            <p className="text-red-500 text-xs mt-1">
              Please enter a valid contact number between 10 and 16 digits.
            </p>
          )}
          {!errors.contact_number &&
            !profileData.contact_number &&
            profileData.contact_number !== "" && (
              <p className="text-gray-500 text-xs mt-1">
                Please enter a valid contact number with at least 10 digits.
              </p>
            )}
        </div>

        {/* Email */}
        <div className="flex flex-col mb-4">
          <div className="flex items-center">
            <label
              htmlFor="email"
              className="block md:text-[16px] text-[12px] font-semibold text-[#05212C] md:w-[100px] w-[70px]"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="flex-grow ml-20">
              <input
                id="email"
                name="email_id"
                type="email"
                value={profileData.email_id}
                onChange={handleInputChange}
                placeholder="Emailid.id@example.com"
                className="py-2 px-3 w-full md:w-full lg:w-[50%] border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm text-[12px]"
              />
            </div>
          </div>
          {errors.email_id && (
            <p className="text-red-500 text-xs mt-1">{errors.email_id}</p>
          )}
        </div>

        {/* Twitter */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="twitter"
            className="block md:text-[16px] text-[12px] font-semibold text-[#05212C] md:w-[100px] w-[70px]"
          >
            Twitter
          </label>
          <div className="flex-grow ml-20">
            <input
              id="twitter"
              name="twitter_id"
              type="url"
              value={profileData.twitter_id}
              onChange={handleInputChange}
              placeholder="http://www.example.com"
              className="py-2 px-3 w-full md:w-full lg:w-[50%] border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm text-[12px]"
            />
          </div>
        </div>

        {/* Telegram */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="telegram"
            className="block md:text-[16px] text-[12px] font-semibold text-[#05212C] md:w-[100px] w-[70px]"
          >
            Telegram
          </label>
          <div className="flex-grow ml-20">
            <input
              id="telegram"
              name="telegram"
              type="url"
              value={profileData.telegram}
              onChange={handleInputChange}
              placeholder ="http://www.example.com"
              className="py-2 px-3 w-full md:w-full sm:w-full  md:w-[80%] lg:w-[50%] border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm text-[12px]"
            />
          </div>
        </div>

        {/* Website */}
        <div className="flex items-center mb-4">
          <label
            htmlFor="website"
            className="block md:text-[16px] text-[12px] font-semibold text-[#05212C] md:w-[100px] w-[70px]"
          >
            Website
          </label>
          <div className="flex-grow ml-20">
            <input
              id="website"
              name="website"
              type="url"
              value={profileData.website}
              onChange={handleInputChange}
              placeholder="http://www.example.com"
              className="py-2 px-3 w-full md:w-full  sm:w-full lg:w-[50%] border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#05212C] focus:border-[#05212C] sm:text-sm text-[12px]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-5 mt-8 md:text-[16px] text-[12px] sm:hidden">
        <button className="py-2 w-[126px] border border-[#0E3746] hover:bg-[#0E3746] hover:text-white rounded-[27px] transition duration-200 ease-in-out">
          Discard
        </button>
        <button
          onClick={handleSaveChangesClick}
          className="py-2 w-[126px] border border-[#0E3746] bg-[#0E3746] text-white hover:bg-[#0E37464D] hover:border-[#0E37464D] rounded-[27px] transition duration-200 ease-in-out"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditPersonalLinksAndContactInfo;