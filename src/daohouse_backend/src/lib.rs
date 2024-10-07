mod types;
use ic_cdk::{api, export_candid, init};
use std::{borrow::BorrowMut, cell::RefCell};
pub mod functions;
pub mod guards;
pub mod routes;
mod state_handler;
use state_handler::State;
mod memory;
use candid::Nat;
use candid::Principal;
pub use functions::*;
use memory::Memory;

pub mod utils;
// mod user_route;
// mod post_route;

// pub mod testing;
// use crate::api::call::{call, call_with_payment128, CallResult};

use types::*;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

#[init]
async fn init(args: InitialArgs) {
    let analytics = Analytics::default();

    with_state(|state| {
        // storing canister data in stable memory
        if let Some(_) = state.canister_data.get(&0) {
            ic_cdk::println!("Canister metaData already available.");
        } else {
            state.canister_data.insert(
                0,
                CanisterData {
                    ic_asset_canister: args.ic_asset_canister_id,
                    dao_canister: args.dao_canister_id,
                    paymeny_recipient: args.payment_recipient,
                },
            );
        }

        // uploading analytics
        if let Some(_) = state.analytics_content.get(&0) {
            ic_cdk::println!("Analytics already available.");
        } else {
            state.analytics_content.insert(0, analytics.clone());
        }

        ()
    });

    with_state(|state| {
        let dao_wasm_module: Vec<u8> =
            include_bytes!("../../../.dfx/local/canisters/dao_canister/dao_canister.wasm").to_vec();

        // let ledger_wasm_module: Vec<u8> =
        //     include_bytes!("../../wasm_modules/icrc1_ledger_canister.wasm").to_vec();

        state.borrow_mut().wasm_module.insert(
            0,
            WasmArgs {
                wasm: dao_wasm_module,
            },
        );

        // match state.wasm_module.get(&0) {
        //     Some(val) => ic_cdk::println!("available"),
        //     None => ic_cdk::println!("not ava"),
        // }
    })
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
