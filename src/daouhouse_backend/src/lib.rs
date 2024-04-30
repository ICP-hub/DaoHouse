mod types;
use ic_cdk::{api, init, query, update, export_candid};
use std::cell::RefCell;
pub mod routes;
use crate::api::call::CallResult;
mod upgrade;
use ic_cdk::{ post_upgrade, pre_upgrade};
mod state_handler;
use state_handler::State;
mod memory;
use memory::Memory; 
mod user_route;


// use candid::{Encode, Decode};

pub mod tesing;

use types::*;

pub async fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}
 

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

// #[init]
// fn init() {
//     let caller = api::caller();
//     let default_profile = Profile {
//         user_id: caller,
//         email_id: String::new(),
//         profile_img: Vec::new(),
//         username: String::new(),
//     };
//     PROFILE_STORE.with(|profile_store| {
//         profile_store.borrow_mut().insert(caller, default_profile);
//     });
// }

// #[update]
// fn create_profile(profile: Profileinput) -> Result<(), String> {
//     let principal_id = api::caller();
   
//     let user_exists = PROFILE_STORE.with(|profile_store| {
//         profile_store.borrow().contains_key(&principal_id)
//     });
//     if user_exists {
//         return Err("User already exists".to_string());
//     }
    
//     if !profile.email_id.contains("@") || !profile.email_id.contains(".") {
//         return Err("Invalid email address".to_string());
//     }
//     let new_profile = Profile {
//         user_id: principal_id,
//         email_id: profile.email_id,
//         profile_img: profile.profile_img,
//         username: profile.username,
//     };
//     PROFILE_STORE.with(|profile_store| {
//         profile_store.borrow_mut().insert(principal_id, new_profile);
//     });
//     Ok(())
// }

// #[query]
// fn get_profile() -> Option<Profile> {
//     let principal_id = api::caller();
//     PROFILE_STORE.with(|profile_store| {
//         profile_store.borrow().get(&principal_id).cloned()
//     })
// }

// #[update]
// fn update_profile(profile: Profileinput) ->Result<(), String> {
//     let principal_id = api::caller();

//     if !profile.email_id.contains("@") || !profile.email_id.contains(".") {
//         return Err("Invalid email address".to_string());
//     }
//     let new_profile = Profile {
//         user_id: principal_id,
//         email_id: profile.email_id,
//         profile_img: profile.profile_img,
//         username: profile.username,
//     };
//     PROFILE_STORE.with(|profile_store| {
//         profile_store.borrow_mut().insert(principal_id, new_profile);
//     });
//     Ok(())

// }

// #[update]
// fn delete_profile() {
//     let principal_id = api::caller();
//     PROFILE_STORE.with(|profile_store| {
//         profile_store.borrow_mut().remove(&principal_id);
//     });
// }

// #[update]
// pub fn createanewDao(){
//     let caller = api::caller();

    
// }


#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
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