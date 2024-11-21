import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import Container from "../Container/Container";
import { useAuth } from "../../connect/useClient";
import { Principal } from "@dfinity/principal";

const AddMember = ({ setActiveStep, setActiveLink, data }) => {
    const { daoCanisterId } = useParams();
    const { createDaoActor1 } = useAuth();
    const navigate = useNavigate();
    const [addMember, setAddMember] = useState({
        group_name: "",
        description: "",
        new_member: "",
    });
    const [groupNames, setGropNames] = useState([]);

    const className = "DAO__Step1";

    const movetodao = () => {
        navigate(`/dao/profile/${daoCanisterId}`);
    };

    const handleChange = (e) => {
        setAddMember({
            ...addMember,
            [e.target.name]: e.target.value,
        });
    };


    const submitDaoConfig = async () => {
        if (
            addMember.group_name === "" ||
            addMember.description === "" ||
            addMember.new_member === ""
        ) {
            toast.error("All fields are required.");
            return;
        }

        const formattedInputData = {
            group_name: addMember.group_name,
            description: addMember.description,
            new_member: Principal.fromText(addMember.new_member),
        };

        try {
            const daoCanister = await createDaoActor1(daoCanisterId);
            const response = await daoCanister.proposal_to_add_member_to_group(formattedInputData);
            console.log("Response from  add member proposal:", response);
            if (response.Ok) {
                toast.success("Add member proposal created successfully");
                movetodao();
                setActiveLink("proposals");
                setAddMember({
                    group_name: "",
                    description: "",
                    new_member: "",
                });
            }
            else {
                toast.error("Failed to create Add Member proposal");
            }

        } catch (error) {
            console.error("Error during proposal submission:", error);

        }
    };


    useEffect(() => {

        const fetchGroupNames = async () => {

            const daoCanister = await createDaoActor1(daoCanisterId);
            const daogroups = await daoCanister.get_dao_groups();
            const names = daogroups.map(group => group.group_name);
            setGropNames(names)
        };

        fetchGroupNames();
    }, []);


    return (
        <React.Fragment>
            <Container>
                <div
                    className={`${className}__form bg-[#F4F2EC] mobile:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col mobile:gap-4 gap-2`}
                >
                    {/* Group Name */}
                    <label htmlFor="group_name" className="font-semibold mobile:text-base text-sm">
                        Group Name
                    </label>
                    <select
                        name="group_name"
                        required
                        value={addMember.group_name}
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Group Name</option>
                        {groupNames.map((name, index) => (
                            <option key={index} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    {/* Description */}
                    <label htmlFor="description" className="font-semibold mobile:text-base text-sm">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={addMember.description}
                        placeholder="Specify the description of the group"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
                        onChange={handleChange}
                    />

                    {/* New Member (Principal ID) */}
                    <label htmlFor="new_member" className="font-semibold mobile:text-base text-sm">
                        New Member (principal ID)
                    </label>
                    <input
                        type="text"
                        name="new_member"
                        value={addMember.new_member}
                        placeholder="Enter New Member Principal ID"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
                        onChange={handleChange}
                    />
                </div>

                <div className={`${className}__submitButton w-full flex flex-row items-center justify-end`}>
                    <button
                        type="button"
                        onClick={submitDaoConfig}
                        className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
                    >
                        Propose Change
                    </button>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default AddMember;
