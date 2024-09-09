import React, { useState } from 'react';
import { useAuth, useAuthClient } from "../../Components/utils/useAuthClient";
import { AuthClient } from "@dfinity/auth-client";
import { useEffect } from 'react';

export default function Widget() {
    const { backendActor, frontendCanisterId, identity } = useAuth();
    const [analtics, setGetAnaltics] = useState({});
    console.log("my analytics data", analtics);
    const daosdata = analtics?.dao_counts ? Number(analtics.dao_counts) : 0;
    const propsaldata = analtics?.proposals_count ? Number(analtics.proposals_count) : 0;
    const membersdata = analtics?.members_count ? Number(analtics.members_count) : 0;
    const postsdata = analtics?.post_count ? Number(analtics.post_count) : 0;
    const getanaltics = async () => {
        try {
            const response = await backendActor.get_analytics();
            console.log("anltyics_API_response", response)
            setGetAnaltics(response.Ok || {})
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
    }

    const authClient = useAuthClient()
    const prinic = authClient.getPrincipalId()
    console.log("value ", prinic)

    useEffect(() => {
        getanaltics()
    }, [backendActor]);
    const statistics = [
        { label: 'Members', value: membersdata + "" },
        { label: 'Proposals', value: propsaldata + "" },
        { label: 'DAOs', value: daosdata + "" },
        { label: 'Posts', value: postsdata + "" }
    ];

    return (
        <div className="bg-white p-5 rounded-lg shadow-md w-fit md:mx-0 mx-6">
            <div className="flex justify-between items-center flex-wrap">
                {statistics.map((statistic, index) => (
                    <div className="text-center mx-6" key={index}>
                        <div className="text-[#0E3746] font-semibold text-[20px] md:text-[40px]">{statistic.value}</div>
                        <div className="text-[#0E3746] text-[12px] md:text-[16px] font-medium">{statistic.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
