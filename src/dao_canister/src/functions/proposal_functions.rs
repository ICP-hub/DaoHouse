use crate::guards::*;
use crate::proposal_route::check_proposal_state;
use crate::types::{Dao, ProposalInput, Proposals};
use crate::{proposal_route, with_state, ProposalState, VoteParam};
use candid::Principal;
use ic_cdk::api;
use ic_cdk::api::call::CallResult;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{query, update};
use sha2::{Digest, Sha256};

#[update(guard=check_members)]
async fn create_proposal(daohouse_backend_id: String, proposal: ProposalInput) -> String {
    let uuids = raw_rand().await.unwrap().0;
    let proposal_id = format!("{:x}", Sha256::digest(&uuids));
    let response = with_state(|state| {
        proposal_route::create_new_proposal(state, proposal.clone(), proposal_id.clone())
    });

    let _res: CallResult<(String,)> = ic_cdk::call(
        Principal::from_text(daohouse_backend_id).unwrap(),
        "update_proposal_count",
        (),
    )
    .await;

    response
}

// get all proposals
#[query]
fn get_all_proposals() -> Vec<Proposals> {
    with_state(|state| {
        let mut proposals: Vec<Proposals> = Vec::with_capacity(state.proposals.len() as usize);
        for (_, v) in state.proposals.iter() {
            proposals.push(v.clone());
        }
        proposals
    })
}

// get user specific user
#[update(guard=prevent_anonymous)]
fn get_my_proposal() -> Result<Vec<Proposals>, String> {
    // with_state(|state| state.proposals.)

    with_state(|state| {
        let mut proposals: Vec<Proposals> = Vec::new();

        for v in state.proposals.iter() {
            if v.1.created_by == api::caller() {
                proposals.push(v.1.clone());
            }
        }
        Ok(proposals)
    })
}

#[query]
async fn get_proposal_by_id(proposal_id: String) -> Proposals {
    with_state(|state| state.proposals.get(&proposal_id).unwrap().clone())
}

#[query]
async fn get_dao_detail() -> Dao {
    with_state(|state| state.dao.clone())
}

#[update(guard = check_members)]
fn change_proposal_state(
    proposal_id: String,
    proposal_state: ProposalState,
) -> Result<String, String> {
    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            pro.proposal_status = proposal_state;
            state.proposals.insert(proposal_id, pro.to_owned());
            Ok(format!("State changed to {:?} ", pro.proposal_status))
        }
        None => Err(String::from("Proposal does not exist.")),
    })
}

#[update]
fn refresh_proposals() -> Result<(), String> {
    with_state(|state| {
        let mut to_update = Vec::new();
        for (key, proposal) in state.proposals.iter() {
            if check_proposal_state(&proposal.proposal_expired_at) {
                to_update.push(key.clone());
            }
        }

        // Update the proposals
        for key in to_update {
            if let Some(mut proposal) = state.proposals.get(&key) {
                proposal.proposal_status = ProposalState::Expired;
            }
        }
    });

    Ok(())
}

#[update]
fn comment_on_proposal(comment: String, proposal_id: String) -> Result<String, String> {
    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            pro.comments_list.push(comment);
            pro.comments += 1;
            state.proposals.insert(proposal_id, pro.to_owned());
            Ok(String::from("Comment was sucessfully added"))
        }
        None => Err(String::from("Proposal does not exist.")),
    })
}

// add guards
#[update]
fn vote(proposal_id: String, voting: VoteParam) -> Result<String, String> {
    check_voting_right(&proposal_id)?;
    let principal_id = api::caller();

    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            if voting == VoteParam::Yes {
                pro.approved_votes_list.push(principal_id);
                pro.proposal_approved_votes += 1;

                state.proposals.insert(proposal_id, pro.to_owned());
                Ok(String::from("Successfully voted in favour of Proposal."))
            } else {
                pro.rejected_votes_list.push(principal_id);
                pro.proposal_rejected_votes += 1;

                state.proposals.insert(proposal_id, pro.to_owned());
                Ok(String::from("Successfully voted against the proposal."))
            }
        }
        None => Err(String::from("Proposal ID is invalid !")),
    })
}
