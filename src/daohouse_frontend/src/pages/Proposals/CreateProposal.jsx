import React, { useState } from 'react';
import proposals from "../../../assets/proposals.png"
import createProposal from "../../../assets/proposal.gif"
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../utils/quilConfig';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import 'react-quill/dist/quill.bubble.css'


function CreateProposal() {
    const [proposalType, setProposalType] = useState('Text');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [inputfieldsData, setInputFieldsData] = useState({
        proposalRecipient: "",
        proposalAmount: "",
        proposalContract: "",
        proposalMethod: "",
        proposalArguments: "",
        proposalGas: "",
        proposalDeposit: "",
        proposalAccountID: "",
        proposalRole: "",
        RemoveProposalAccountId: "",
        RemoveProposalRole: "",
        proposalDescription: "",
    })

    const className = "CreateProposals";
    const proposalTypes = [
        "Text",
        "Transfer",
        "Function Call",
        "Add Member",
        "Remove Member"
    ];

    const handleChange = (name, value) => {
        setInputFieldsData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleProposalTypeChange = (value) => {
        setProposalType(value);
        setDropdownOpen(!dropdownOpen)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const payload = {
            proposal_receiver_id: "dao ID",
            created_by: "user",
            proposal_amount: inputfieldsData.proposalAmount,
            proposal_title: "dao title",
            proposal_description: inputfieldsData.proposalDescription,
        }
        console.log(inputfieldsData, 'inputfieldsData')
    };

    const renderAdditionalFields = () => {
        switch (proposalType) {
            case 'Transfer':
                return (
                    <div>
                        <label className="block mb-2 font-semibold text-xl">Recipient</label>
                        <input type="text" placeholder="Specify Account if any" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                            name="proposalRecipient"
                            value={inputfieldsData.proposalRecipient}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        /><br />
                        <div className="flex flex-wrap flex-row w-full gap-4">

                            <div className="flex-1">

                                <label className="block mb-2 font-semibold text-xl">Token</label>
                                <select className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent">
                                    {/* Options for token */}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block mb-2 font-semibold text-xl">Amount</label>

                                <input type="number" placeholder="Write here number type input" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                    name="proposalAmount"
                                    value={inputfieldsData.proposalAmount}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'Function Call':
                return (
                    <div>
                        <label className="block mb-2 font-semibold text-xl">Contract</label>
                        <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent" name="proposalContract"
                            value={inputfieldsData.proposalContract}
                            onChange={(e) => handleChange(e.target.name, e.target.value)} /><br />
                        <label className="block mb-2 font-semibold text-xl">Method</label>
                        <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent" name="proposalMethod"
                            value={inputfieldsData.proposalMethod}
                            onChange={(e) => handleChange(e.target.name, e.target.value)} /><br />
                        <label className="block mb-2 font-semibold text-xl">Arguments (JSON)</label>
                        <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent" name="proposalArguments"
                            value={inputfieldsData.proposalArguments}
                            onChange={(e) => handleChange(e.target.name, e.target.value)} /><br />
                        <div className="flex flex-wrap flex-row w-full gap-4">
                            <div className="flex-1">
                                <label className="block mb-2 font-semibold text-xl">Gas (Tgas)</label>
                                <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent" name="proposalGas"
                                    value={inputfieldsData.proposalGas}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)} />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-2 font-semibold text-xl">Deposit</label>
                                <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent" name="proposalDeposit"
                                    value={inputfieldsData.proposalDeposit}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)} />
                            </div>
                        </div>
                    </div>
                );
            case 'Add Member':
                return (
                    <div className="flex md:flex-row flex-col flex-wrap flex-row w-full gap-4">
                        <div className="flex-1">
                            <label className="block mb-2 font-semibold text-xl">Account ID</label>
                            <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                name='proposalAccountID'
                                value={inputfieldsData.proposalAccountID}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 font-semibold text-xl">Role</label>
                            <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                name='proposalRole'
                                value={inputfieldsData.proposalRole}
                                onChange={(e) => handleChange(e.target.name, e.target.value)} />
                        </div>
                    </div>
                );
            case 'Remove Member':
                return (
                    <div className="flex md:flex-row flex-col flex-wrap flex-row w-full gap-4">
                        <div className="flex-1">
                            <label className="block mb-2 font-semibold text-xl">Account ID</label>
                            <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                name='RemoveProposalAccountId'
                                value={inputfieldsData.RemoveProposalAccountId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 font-semibold text-xl">Role</label>
                            <input type="text" className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                name='RemoveProposalRole'
                                value={inputfieldsData.RemoveProposalRole}
                                onChange={(e) => handleChange(e.target.name, e.target.value)} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-zinc-200 w-full">
            <div
                className={`${className}__filter w-full h-[25vh] p-20 flex flex-col items-start justify-center`}
                style={{
                    backgroundImage: `url("${proposals}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <h1 className="text-[40px] p-2 text-white border-b-2 border-white">Proposals</h1>
            </div>

            <div className={`${className}__label bg-[#c8ced3] relative py-8 px-10 flex gap-2 flex-col w-full justify-between items-center`}>
                <p className="text-[40px] text-black px-8 mr-auto flex flex-row justify-start items-center gap-4">
                    Create Proposal
                    <div className="flex flex-col items-start">
                        <div className="w-32 border-t-2 border-black"></div>
                        <div className="w-14 mt-2 border-t-2 border-black"></div>
                    </div>
                </p>

                <div className="mx-auto bg-[#F4F2EC] p-6 m-6 rounded-lg shadow w-full">
                    <h1 className="text-xl font-semibold mb-4">Proposal Type</h1>
                    <div className="mb-6 max-w-6xl relative">
                        <div
                            className="mt-1 block bg-transparent w-full rounded-xl  pl-3 pr-10 py-3 text-base border border-[#aba9a5] border-opacity-30 focus:outline-none focus:ring-indigo-500 focus:border-[#aba9a5] sm:text-sm rounded-md cursor-pointer flex items-center justify-between"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {proposalType || "Select Type here"}
                            <span className="ml-2">
                                {dropdownOpen ? <BsChevronUp color='#7a7976' /> : <BsChevronDown color='#7a7976' />}
                            </span>
                        </div>
                        {dropdownOpen && (
                            <div className="absolute mt-1 w-full rounded-md bg-[#AAC8D6]  shadow-lg z-10">
                                <div className="flex gap-4  p-2">
                                    {proposalTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleProposalTypeChange(type)}
                                            className={`px-2 py-1 flex-1 rounded border-white border-2  ${proposalType === type ? 'bg-[#DFE9EE] text-[#229ED9] font-medium' : 'bg-[#AAC8D6] text-white bg-transparent'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='max-w-6xl'>
                        {renderAdditionalFields()}
                    </div>

                    <div className='my-4'>
                        <h1 className="text-xl font-semibold mb-4">Proposal Description</h1>
                        <div className="mb-6 max-w-6xl mt-4 relative editor-container">
                            <div className="proposal-content" >
                                <ReactQuill
                                    value={inputfieldsData.proposalDescription}
                                    onChange={(value) => handleChange("proposalDescription", value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder='Write here...'
                                    className='proposal-editor rounded-xl'
                                />
                            </div>
                        </div>
                    </div>



                    <div className="flex justify-center my-8">
                        <button
                            className="bg-[#0E3746] hover:bg-[#819499] text-white font-normal text-center rounded-full text-[16px] py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="absolute right-10 top-10">
                    <img src={createProposal} alt="Illustration" className="w-[350px] h-[350px]" />
                </div>

            </div>
        </div>
    );
}

export default CreateProposal;
