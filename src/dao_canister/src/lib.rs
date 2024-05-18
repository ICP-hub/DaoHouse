mod types;
use ic_cdk::{api, init, export_candid};
use std::cell::RefCell;
pub mod proposal_route;
// use crate::api::call::CallResult;
mod upgrade;
use ic_cdk::{ post_upgrade, pre_upgrade};
mod state_handler;
use state_handler::State;
mod memory;
// use memory::Memory; 
mod functions;
use std::collections::HashMap;
// #[macro_use]
extern crate ic_cdk_macros;
use types::*;
use candid::Principal;

pub async fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}
 

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}



#[init]
async fn init(dao_input: DaoInput) { 
    let principal_id = api::caller();
    let new_dao = Dao {
        dao_id: principal_id,
        dao_name: dao_input.dao_name,
        purpose: dao_input.purpose,
        daotype: dao_input.daotype,
        link_of_document: dao_input.link_of_document,
        cool_down_period: dao_input.cool_down_period,
        tokenissuer: dao_input.tokenissuer,
        linksandsocials: dao_input.linksandsocials,
        group_name: vec!["council".to_string()],
        groups_count: 1,
        required_votes: dao_input.required_votes,
    };

    let council_list = GroupList {
        users: dao_input.members,
    };

    with_state(|state| {
        state.dao = new_dao.clone();
        state.groups.insert("council".to_string(), council_list);
    }).await;
}





#[pre_upgrade]
fn pre_upgrade() {
    upgrade::pre_upgrade();
}

#[post_upgrade]
fn post_upgrade() {
    upgrade::post_upgrade();
}

export_candid!();