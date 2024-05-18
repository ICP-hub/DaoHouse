mod types;
use ic_cdk::{api, export_candid};
use std::cell::RefCell;
pub mod routes;
pub mod functions;
mod state_handler;
use state_handler::State;
mod memory;
use memory::Memory; 
use candid:: Principal;


// mod user_route;
// mod post_route;

// pub mod testing;

use types::*;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
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