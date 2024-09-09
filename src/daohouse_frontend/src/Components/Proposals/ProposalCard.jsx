import React from 'react';
import Card from './Card';

const ProposalCard = ({ proposal }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg flex md:flex-row flex-col relative w-full">
            <div className="md:w-full">
                <Card proposal={proposal} />
            </div>
        </div>
    );
}

export default ProposalCard;
