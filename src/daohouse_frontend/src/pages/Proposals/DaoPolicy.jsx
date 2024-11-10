import React from "react";
import { useEffect } from "react";

const DaoPolicy = ({ changePolicy, handleInputDaoPolicy, dao ,setShowModal,isPrivate,showModal,cancelMakePrivate,confirmMakePrivate,modalMessage}) => {
    
   return(

    
    
    <div>
      
        
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-lg bg-white  rounded-lg shadow-lg w-11/12 md:w-1/3 p-6  border border-gray-300 p-4 rounded shadow flex flex-col justify-between h-auto sm:w-[400px] md:w-[45%] lg:w-[30%]">
            <div>
              <h2 className="font-bold text-center  font-mulish text-[18px] mb-2">Privacy Confirmation</h2>
            </div>
            <p className="text-center mb-4 ">
              {modalMessage}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:justify-between">
              <button
                onClick={cancelMakePrivate}
                className="text-black bg-white hover:bg-gray-100 font-medium font-mulish rounded-full text-sm px-4 py-2 sm:px-5 lg:px-8 border border-gray-500 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={confirmMakePrivate}
                className="text-white bg-black hover:bg-gray-900 font-medium font-mulish rounded-full text-sm px-4 py-2 sm:px-5 lg:px-8 border border-gray-500 w-full sm:w-auto"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    <form className="space-y-4">
       

        <div className="mb-4">
            <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
            <textarea
                id="description"
                type="text"
                name="description"
                value={changePolicy.description}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Description"
                rows={4}
                required
            />
        </div>

        {/* <div className="mb-4">
            <label htmlFor="actionMember" className="mb-2 font-semibold text-xl">Action Member (Principal)</label>
            <input
                id="actionMember"
                type="text"
                name="action_member"
                value={changePolicy.action_member}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Action Member Principal"
            />
        </div> */}

        <div className="mb-4">
            <label htmlFor="coolDownPeriod" className="mb-2 font-semibold text-xl">Cool Down Period</label>
            <input
                id="coolDownPeriod"
                type="number"
                name="cool_down_period"
                value={changePolicy.cool_down_period || dao.cool_down_period}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Cool Down Period"
                required
                min={1}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="requiredVotes" className="mb-2 font-semibold text-xl">Required Votes</label>
            <input
                id="requiredVotes"
                type="number"
                name="required_votes"
                value={changePolicy.required_votes || dao.required_votes}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Required Votes"
                required
                min={1}
            />
        </div>
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <span className="text-gray-800">Create DAO  Private Proposal</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dao.ask_to_join_dao}
                onChange={() => { setShowModal(true) }}
                className="hidden toggle-checkbox"
              />
              <div
                className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${isPrivate ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isPrivate ? 'translate-x-5' : ''}`}
                ></div>
              </div>
            </label>
          </div>
    </form>
    </div>
   )};

export default DaoPolicy;
