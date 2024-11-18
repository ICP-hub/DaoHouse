import React, { useEffect, useState } from "react";

const Poll = ({ poll, pollOptionError ,handleInputPoll, setPoll, pollTitleError, pollDescriptionError,setPollOptionError }) => {
    const [options, setOptions] = useState([]); 
    const [newOption, setNewOption] = useState("");

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        setPoll((prevPoll) => ({
            ...prevPoll,
            proposal_created_at: getTodayDate(),
        }));
    }, [setPoll]);

    const addOption = () => {
        if (options.some(optionObj => optionObj.option.trim().toLowerCase() === newOption.trim().toLowerCase())) {
            setPollOptionError("Options can't be the same");
            return;
        }
        else if (newOption.trim() && options.length < 4) {
            setOptions([...options, { option: newOption }]);
            setNewOption("");
            setPoll((prevPoll) => ({
                ...prevPoll,
                poll_options: [...options, { option: newOption }],
            }));
            setPollOptionError("")
        } else {
            setPollOptionError("Only Four Options are allowed")
        }
    };

    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        setPoll((prevPoll) => ({
            ...prevPoll,
            poll_options: newOptions,
        }));
    };

    return (
        <form className="space-y-4">
            <div className="mb-4">
                <label htmlFor="pollTitle" className="mb-2 font-semibold text-xl">Poll Title</label>
                <input
                    id="pollTitle"
                    type="text"
                    name="poll_title"
                    value={poll.poll_title}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Poll Title"
                    required
                />
                {pollTitleError && <p className="text-red-500 text-sm">{pollTitleError}</p>} {/* Display error */}
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
                <textarea
                    id="description"
                    type="text"
                    name="description"
                    value={poll.description}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Description"
                    rows={4}
                    required
                />
                {pollDescriptionError && <p className="text-red-500 text-sm">{pollDescriptionError}</p>} {/* Display error */}
            </div>

            {/* Add option input and button */}
            <div className="mb-4">
                <label htmlFor="pollOptions" className="mb-2 font-semibold text-xl">Poll Options</label>
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add option"
                        className="w-full px-4 py-2 border border-[#aba9a5] rounded-lg bg-white"
                    />
                    <button
                        type="button"
                        onClick={addOption}
                        className="bg-[#0E3746] text-white px-4 py-2 rounded-lg"
                    >
                        ADD
                    </button>
                </div>
                {pollOptionError && <p className="text-red-500">{pollOptionError}</p>}
            </div>

            {/* Display added options only if there's at least one option */}
            {options.length > 0 && (
                <div className="space-y-2">
                    {options.map((optionObj, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-[#D3EDED] px-4 py-2 rounded-lg"
                        >
                            <span>{optionObj.option}</span>
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="text-gray-600 font-bold"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="proposalExpiredAt" className="mb-2 font-semibold text-xl">Expires At</label>
                <input
                    id="proposalExpiredAt"
                    type="date"
                    name="proposal_expired_at"
                    value={poll.proposal_expired_at}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    min={getTodayDate()}
                    required
                />
            </div>
        </form>
    );
};

export default Poll;