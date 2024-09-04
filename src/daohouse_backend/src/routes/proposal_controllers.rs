use crate::{state_handler::State, ProposalValueStore};

// to record new proposals
pub fn add_proposal_controller(
    state: &mut State,
    args: ProposalValueStore,
) -> Result<String, String> {
    state.proposal_store.insert(args.proposal_id.clone(), args);

    Ok(String::from("Proposal added"))
}

// to get all proposals
pub fn get_proposal_controller(
    state: &mut State,
    pagination: crate::Pagination,
) -> Vec<ProposalValueStore> {
    let mut all_proposals: Vec<ProposalValueStore> = Vec::new();

    for (_key, proposal) in state.proposal_store.iter() {
        all_proposals.push(proposal);
    }

    let ending = all_proposals.len();

    if ending == 0 {
        return vec![];
    }

    let start = pagination.start as usize;
    let end = pagination.end as usize;

    if start < ending {
        let end = end.min(ending);
        return all_proposals[start..end].to_vec();
    }

    all_proposals
}

// to delete proposal
pub fn delete_proposal_controller(
    state: &mut State,
    proposal_id: &String,
) -> Result<String, String> {
    let res = state.proposal_store.remove(proposal_id);

    // match res {
    //     Some(_val) => Ok(String::from("Proposal deleted successfully")),
    //     None => return Err(String::from("Failed to delete proposal")),
    // }

    Ok(String::from("Propsal deleted"))
}
