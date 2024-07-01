use candid::Principal;
use ic_cdk::api::management_canister::main::raw_rand;
use crate::types::{ProposalInput,Proposals,Dao};
use sha2::{Digest, Sha256};
use crate::{proposal_route, with_state};
use ic_cdk::{query, update};
use ic_cdk::api;



#[update]
async fn create_proposal(proposal: ProposalInput) -> String {
    let uuids = raw_rand().await.unwrap().0;
    let proposal_id = format!("{:x}", Sha256::digest(&uuids)); 
    with_state(|state| proposal_route::create_new_proposal(state, proposal.clone(),proposal_id.clone()))
}


// get all proposals 
#[query]
fn get_all_proposals() -> Vec<Proposals> {
    with_state(|state| {
        let mut proposals: Vec<Proposals> = Vec::with_capacity(state.proposals.len() as usize);
        for (_, v ) in state.proposals.iter() {
            proposals.push(v.clone())
        };
        proposals
    })
}

// get user specific user
#[query]
fn get_my_proposal() -> Result<Vec<Proposals>, String> {
    let principal_id = api::caller();
    if principal_id == Principal::anonymous() {
        return Err(String::from("Anonymous principal not allowed"));
    }
    with_state(|state| {
        let mut proposals: Vec<Proposals> = Vec::new();

        for (_, v) in state.proposals.iter() {
            if v.created_by == principal_id {
                proposals.push(v.clone())
            }
        } 
        Ok(proposals)
    } )
}


#[query]
async fn get_proposal_by_id(proposal_id: String) -> Proposals {
    with_state(|state| state.proposals.get(&proposal_id).unwrap().clone())
}


#[query]
async fn get_dao_detail() -> Dao {
    with_state(|state| state.dao.clone())
}

// #[query]
// fn get_all_daos() -> Vec<Dao> {

//     with_state(|state| state.dao.)
// }

