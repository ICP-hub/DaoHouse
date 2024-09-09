// Proposal routes

use crate::{
    routes::{
        add_proposal_controller, delete_proposal_controller, get_latest_proposal_controller,
        get_proposal_controller,
    },
    with_state, ProposalValueStore,
};

#[ic_cdk::update]
pub fn add_proposal(args: crate::ProposalValueStore) -> Result<String, String> {
    // with_state(|state| add_proposal_controller(state, args))
    //     .map_err(|err| return format!("Error in proposal: {:?}", err))

    with_state(|state| {
        let analytics = state.analytics_content.get(&0);

        add_proposal_controller(state, args)
            .map_err(|err| return format!("Error in proposal: {:?}", err))?;

        match analytics {
            Some(mut val) => {
                val.proposals_count = val.proposals_count + 1;
                state.analytics_content.insert(0, val);
                Ok(String::from(crate::utils::SUCCESS_PROPOSAL))
            }

            None => return Err(String::from(crate::utils::ERROR_ANALYTICS)),
        }
    })
}

#[ic_cdk::query]
pub fn get_proposals(args: crate::Pagination) -> Vec<ProposalValueStore> {
    with_state(|state| get_proposal_controller(state, args))
}

// get latest proposals
#[ic_cdk::query]
pub fn get_latest_proposals(args: crate::Pagination) -> Vec<ProposalValueStore> {
    with_state(|state| get_latest_proposal_controller(state, args))
}

#[ic_cdk::update]
pub fn delete_proposal(proposal_id: String) -> Result<String, String> {
    with_state(|state| delete_proposal_controller(state, &proposal_id))
}
