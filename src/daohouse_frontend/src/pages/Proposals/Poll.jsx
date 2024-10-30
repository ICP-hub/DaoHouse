import React, { useEffect, useState } from "react";

const Poll = ({ poll, handleInputPoll, setPoll }) => {
    const [options, setOptions] = useState([{ option: "" }]); // Initialize with one option as an object

    // Get today's date in the format YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        // Set today's date for "Created At" field when the component loads
        setPoll((prevPoll) => ({
            ...prevPoll,
            proposal_created_at: getTodayDate(),
        }));
    }, [setPoll]);

    // Handler to manage poll options as an array of objects
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = { option: value };
        setOptions(newOptions);
        setPoll((prevPoll) => ({
            ...prevPoll,
            poll_options: newOptions,
        }));
    };

    // Add a new option up to the limit of 4
    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, { option: "" }]);
        }
    };

    // Remove an option
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
            </div>

            <div className="mb-4">
                <label htmlFor="options" className="mb-2 font-semibold text-xl">Poll Options</label>
                {options.map((optionObj, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={optionObj.option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                        {options.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="px-3 py-1 rounded-lg text-red-500"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                {options.length < 4 && (
                    <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 text-blue-500"
                    >
                        Add Option
                    </button>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="proposalCreatedAt" className="mb-2 font-semibold text-xl">Created At</label>
                <input
                    id="proposalCreatedAt"
                    type="date"
                    name="proposal_created_at"
                    value={poll.proposal_created_at}
                    onChange={handleInputPoll}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    disabled
                    required
                />
            </div>

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
