import React, { useEffect, useState } from "react";

const Poll = ({ poll, handleInputPoll, setPoll }) => {
    const [options, setOptions] = useState([]); // Start with an empty array to hide initially
    const [newOption, setNewOption] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [formErrors, setFormErrors] = useState({}); // State to hold error messages for fields

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

    // Add a new option up to the limit of 4, and check for duplicates
    const addOption = () => {
        if (newOption.trim() === "") {
            setErrorMessage("Option cannot be empty.");
            return;
        }
        if (options.length >= 4) {
            setErrorMessage("You can add a maximum of 4 options.");
            return;
        }
        if (options.some(option => option.option.toLowerCase() === newOption.toLowerCase())) {
            setErrorMessage("Poll options must be unique.");
            return;
        }

        setOptions([...options, { option: newOption }]);
        setNewOption("");
        setPoll((prevPoll) => ({
            ...prevPoll,
            poll_options: [...options, { option: newOption }],
        }));
        setErrorMessage(""); // Clear any existing error messages
    };

    // Remove an option
    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        setPoll((prevPoll) => ({
            ...prevPoll,
            poll_options: newOptions,
        }));
        setErrorMessage(""); // Clear error message when option count changes
    };

    // Validate required fields
    const validateFields = () => {
        const errors = {};
        if (!poll.poll_title.trim()) {
            errors.poll_title = "Please fill in the poll title.";
        }
        if (!poll.description.trim()) {
            errors.description = "Please fill in the description.";
        }
        if (!poll.proposal_expired_at) {
            errors.proposal_expired_at = "Please select an expiration date.";
        }
        setFormErrors(errors);
    };

    // Trigger validation when poll values change
    useEffect(() => {
        validateFields();
    }, [poll]);

    return (
        <form className="space-y-4">
            <div className="mb-4">
                <label htmlFor="pollTitle" className="mb-2 font-semibold text-xl">Poll Title</label>
                <input
                    id="pollTitle"
                    type="text"
                    name="poll_title"
                    value={poll.poll_title}
                    onChange={(e) => {
                        handleInputPoll(e);
                        setFormErrors({ ...formErrors, poll_title: "" }); // Clear error on input
                    }}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Poll Title"
                    required
                />
                {formErrors.poll_title && <p className="text-red-500">{formErrors.poll_title}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
                <textarea
                    id="description"
                    type="text"
                    name="description"
                    value={poll.description}
                    onChange={(e) => {
                        handleInputPoll(e);
                        setFormErrors({ ...formErrors, description: "" }); // Clear error on input
                    }}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Description"
                    rows={4}
                    required
                />
                {formErrors.description && <p className="text-red-500">{formErrors.description}</p>}
            </div>

            {/* Add option input and button */}
            <div className="mb-4">
                <label htmlFor="polltitle" className="mb-2 font-semibold text-xl">Poll Options</label>
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={newOption}
                        onChange={(e) => {
                            setNewOption(e.target.value);
                            setErrorMessage(""); // Clear error when typing starts
                        }}
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
            </div>

            {/* Error Message for Poll Options */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

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
                    onChange={(e) => {
                        handleInputPoll(e);
                        setFormErrors({ ...formErrors, proposal_expired_at: "" }); // Clear error on input
                    }}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    min={getTodayDate()}
                    required
                />
                {formErrors.proposal_expired_at && <p className="text-red-500">{formErrors.proposal_expired_at}</p>}
            </div>
        </form>
    );
};

export default Poll;
