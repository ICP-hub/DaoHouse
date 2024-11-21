import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import Container from "../Container/Container";
import { useAuth } from "../../connect/useClient";
import { Principal } from "@dfinity/principal";

const DaoConfig = ({ setData, setActiveStep,setActiveLink, data }) => {
    const { daoCanisterId } = useParams();
    const { createDaoActor1} = useAuth();
    const navigate = useNavigate();
    const [changeData, setChangeData] = useState({
        new_dao_name: "",
        description: "",
        action_member: "",
    });

    const className = "DAO__Step1";
    const movetodao = () => {
        navigate(`/dao/profile/${daoCanisterId}`);
    };


    // Load saved data or pre-fill from props
    useEffect(() => {
        const savedData = localStorage.getItem("step1Data");
        if (savedData) {
            setChangeData(JSON.parse(savedData));
        } else if (data) {
            setChangeData({
                new_dao_name: data.new_dao_name || "",
                description: data.description || "",
                action_member: data.action_member || "",
            });
        }
    }, [data]);

    // Save changeData to local storage
    useEffect(() => {
        localStorage.setItem("step1Data", JSON.stringify(changeData));
    }, [changeData]);

    // Handle changes in input fields
    function handleChange(e) {
        setChangeData({
            ...changeData,
            [e.target.name]: e.target.value,
        });
    }

    // Submit the DAO configuration
    const submitDaoConfig = async () => {
        // Validate input fields
        if (
            changeData.new_dao_name === "" ||
            changeData.description === "" ||
            changeData.action_member === ""
        ) {
            toast.error("Empty fields are not allowed");
            return;
        }

        // Format input data
        const formattedInputData = {
            new_dao_name: changeData.new_dao_name,
            description: changeData.description,
            action_member: Principal.fromText(changeData.action_member),
        };

        try {
            const daoCanister = await createDaoActor1(daoCanisterId);
            console.log("daoCanister ID:", daoCanisterId);

            // Send the correctly formatted data
            const response = await daoCanister.proposal_to_chnage_dao_config(formattedInputData);
            console.log("Response from proposal:", response);
            toast.success("DAO configuration proposal created successfully");
            movetodao();
            setActiveLink("proposals");
           

        } catch (error) {
            console.error("Error during proposal submission:", error);
            toast.error("Failed to create DAO configuration proposal");
        }
    };

    return (
        <React.Fragment>
            <Container>
                <div
                    className={`${className}__form bg-[#F4F2EC] mobile:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col mobile:gap-4 gap-2`}
                >
                    {/* DAO Name */}
                    <label htmlFor="new_dao_name" className="font-semibold mobile:text-base text-sm">
                        New DAO Name
                    </label>
                    <input
                        type="text"
                        name="new_dao_name"
                        required
                        value={changeData.new_dao_name}
                        placeholder="Enter New DAO Name"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
                        onChange={handleChange}
                    />

                    {/* Purpose */}
                    <label htmlFor="description" className="font-semibold mobile:text-base text-sm">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={changeData.description}
                        placeholder="Specify the description of the DAO"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
                        onChange={handleChange}
                    />

                    {/* Action Member */}
                    <label htmlFor="action_member" className="font-semibold mobile:text-base text-sm">
                        Action Member
                    </label>
                    <input
                        type="text"
                        name="action_member"
                        value={changeData.action_member}
                        placeholder="Enter Action Member"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
                        onChange={handleChange}
                    />
                </div>

                <div className={`${className}__submitButton w-full flex flex-row items-center justify-end`}>
                    <button
                        type="button" // Changed to button to avoid form submission issues
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

export default DaoConfig;
