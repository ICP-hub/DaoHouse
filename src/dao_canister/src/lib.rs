mod types;
use functions::icrc_get_balance;
use ic_cdk::{export_candid, init};
use std::cell::RefCell;
pub mod proposal_route;
mod state_handler;
use state_handler::State;
mod memory;
use memory::Memory;
mod functions;
mod guards;
extern crate ic_cdk_macros;
use candid::Principal;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use types::*;
mod utils;
use candid::Nat;


thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

#[init]
async fn init(dao_input: DaoInput) {
    let proposal_entry: Vec<crate::ProposalPlace> = dao_input
        .proposal_entry
        .iter()
        .map(|proposal| crate::ProposalPlace {
            place_name: proposal.place_name.clone(),
            min_required_thredshold: proposal.min_required_thredshold,
        })
        .collect();

    let new_dao = Dao {
        dao_id: ic_cdk::api::id(),
        dao_name: dao_input.dao_name,
        purpose: dao_input.purpose,
        image_canister: dao_input.image_canister,
        link_of_document: dao_input.link_of_document,
        cool_down_period: dao_input.cool_down_period,
        linksandsocials: dao_input.linksandsocials,
        groups_count: dao_input.dao_groups.len() as u64,
        required_votes: dao_input.required_votes,
        members: dao_input.members.clone(),
        image_id: dao_input.image_id,
        members_count: dao_input.members.len() as u32,
        followers: dao_input.followers.clone(),
        members_permissions: dao_input.members_permissions,
        followers_count: dao_input.followers.len() as u32,
        proposals_count: 0,
        proposal_ids: Vec::new(),
        token_ledger_id: LedgerCanisterId {
            id: Principal::anonymous(),
        },
        tokens_required_to_vote: dao_input.tokens_required_to_vote,
        total_tokens: dao_input.token_supply,
        daohouse_canister_id: dao_input.daohouse_canister_id,
        token_symbol: dao_input.token_symbol,
        proposal_entry: proposal_entry,
        ask_to_join_dao : dao_input.ask_to_join_dao,
        all_dao_user : dao_input.all_dao_user,
        requested_dao_user : Vec::new(),
    };

    with_state(|state| {
        state.dao = new_dao.clone();
        for x in dao_input.dao_groups.iter() {
            state.dao_groups.insert(x.group_name.clone(), x.to_owned());
        }
    });
}

export_candid!();
