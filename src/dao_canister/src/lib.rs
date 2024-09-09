mod types;
use ic_cdk::{export_candid, init};
use std::cell::RefCell;
pub mod proposal_route;
mod state_handler;
use state_handler::State;
mod memory;
use memory::Memory;
mod functions;
mod guards;
// #[macro_use]
extern crate ic_cdk_macros;
use candid::Principal;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use types::*;
mod utils;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

#[init]
async fn init(dao_input: DaoInput) {
    // ic_cdk::println!("data is {:?}", dao_input);

    // let principal_id = api::caller();
    let new_dao = Dao {
        dao_id: ic_cdk::api::id(),
        dao_name: dao_input.dao_name,
        purpose: dao_input.purpose,
        daotype: dao_input.daotype,
        image_canister: dao_input.image_canister,
        link_of_document: dao_input.link_of_document,
        cool_down_period: dao_input.cool_down_period,
        // tokenissuer: dao_input.tokenissuer,
        linksandsocials: dao_input.linksandsocials,
        // group_name: vec!["council".to_string()],
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
        }, // dao_groups: dao_input.dao_groups.clone(), // to be removed (debug impl)
        tokens_required_to_vote: dao_input.tokens_required_to_vote,
        total_tokens: dao_input.token_supply,
        daohouse_canister_id: dao_input.daohouse_canister_id,
        token_symbol: dao_input.token_symbol,
    };

    // let permission = Votingandpermissions {
    //     changedao_config: "council".to_string(),
    //     changedao_policy: "council".to_string(),
    //     bounty: "council".to_string(),
    //     bountydone: "council".to_string(),
    //     transfer: "council".to_string(),
    //     polls: "council".to_string(),
    //     removemembers: "council".to_string(),
    //     addmembers: "council".to_string(),
    //     functioncall: "council".to_string(),
    //     upgradeself: "council".to_string(),
    //     upgraderemote: "council".to_string(),
    //     setvotetoken: "council".to_string(),
    //     votingpermision: "council".to_string(),
    // };

    // let council_list = GroupList {
    //     users: dao_input.members,
    // };

    with_state(|state| {
        state.dao = new_dao.clone();

        for x in dao_input.dao_groups.iter() {
            state.dao_groups.insert(x.group_name.clone(), x.to_owned());
        }
        // state.dao_groups.insert(dao_input.dao_groups., value)
        // for x in dao_i
        // state.permision = permission.clone();
        // state.groups.insert("council".to_string(), council_list);
    });
}

// #[pre_upgrade]
// fn pre_upgrade() {
//     upgrade::pre_upgrade();
// }

// #[post_upgrade]
// fn post_upgrade() {
//     upgrade::post_upgrade();
// }

export_candid!();
