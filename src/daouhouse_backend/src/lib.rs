mod types;

use ic_cdk::{api, init, query, update, export_candid};
use std::cell::RefCell;
use std::collections::BTreeMap;
use candid::{CandidType, Principal};
use serde::Deserialize;
use crate::api::call::CallResult;


// use candid::{Encode, Decode};

pub mod tesing;

use types::*;



type ProfileStore = BTreeMap<Principal, Profile>;

#[derive(Clone, CandidType, Deserialize)]
struct Profile {
    pub user_id: Principal,
    pub email_id: String,
    pub profile_img: Vec<u8>,
    pub username: String,
}

#[derive(Clone,CandidType,Deserialize)]
struct Profileinput{
    pub email_id: String,
    pub profile_img: Vec<u8>,
    pub username: String,
}   

thread_local! {
    static PROFILE_STORE: RefCell<ProfileStore> = RefCell::default();
}

#[init]
fn init() {
    let caller = api::caller();
    let default_profile = Profile {
        user_id: caller,
        email_id: String::new(),
        profile_img: Vec::new(),
        username: String::new(),
    };
    PROFILE_STORE.with(|profile_store| {
        profile_store.borrow_mut().insert(caller, default_profile);
    });
}

#[update]
fn create_profile(profile: Profileinput) -> Result<(), String> {
    let principal_id = api::caller();
   
    let user_exists = PROFILE_STORE.with(|profile_store| {
        profile_store.borrow().contains_key(&principal_id)
    });
    if user_exists {
        return Err("User already exists".to_string());
    }
    
    if !profile.email_id.contains("@") || !profile.email_id.contains(".") {
        return Err("Invalid email address".to_string());
    }
    let new_profile = Profile {
        user_id: principal_id,
        email_id: profile.email_id,
        profile_img: profile.profile_img,
        username: profile.username,
    };
    PROFILE_STORE.with(|profile_store| {
        profile_store.borrow_mut().insert(principal_id, new_profile);
    });
    Ok(())
}

#[query]
fn get_profile() -> Option<Profile> {
    let principal_id = api::caller();
    PROFILE_STORE.with(|profile_store| {
        profile_store.borrow().get(&principal_id).cloned()
    })
}

#[update]
fn update_profile(profile: Profileinput) ->Result<(), String> {
    let principal_id = api::caller();

    if !profile.email_id.contains("@") || !profile.email_id.contains(".") {
        return Err("Invalid email address".to_string());
    }
    let new_profile = Profile {
        user_id: principal_id,
        email_id: profile.email_id,
        profile_img: profile.profile_img,
        username: profile.username,
    };
    PROFILE_STORE.with(|profile_store| {
        profile_store.borrow_mut().insert(principal_id, new_profile);
    });
    Ok(())

}

#[update]
fn delete_profile() {
    let principal_id = api::caller();
    PROFILE_STORE.with(|profile_store| {
        profile_store.borrow_mut().remove(&principal_id);
    });
}

#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}


// #[derive(CandidType, Deserialize)]
// struct CreateCanisterArgument {{
//     // Your struct fields here
// }}

// #[derive(CandidType, Deserialize)]
// struct InstallCodeArgument {{
//     // Your struct fields here
// }}

// pub async fn create_canister_and_install_code(create_arg: CreateCanisterArgument, install_arg: InstallCodeArgument) -> Result<(), String> {{
//     // Your create canister logic here

//     // Your install code logic here
// }}

// #[update]
// async fn run() {{
//     let create_canister_arg = CreateCanisterArgument {{
//         // Initialize your struct fields here
//     }};

//     let install_code_arg = InstallCodeArgument {{
//         // Initialize your struct fields here
//     }};

//     create_canister_and_install_code(create_canister_arg, install_code_arg).await.unwrap();
// }}





export_candid!();