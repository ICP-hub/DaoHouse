// use std::ptr::null;

use crate::State;
// use crate::{types::*, with_state};
use ic_cdk::api;
// use candid::Principal;

use crate::types::{UserProfile,Profileinput};
// use crate::api::call::{call, call_with_payment128, CallResult};
// use crate::api::canister_version;


pub fn create_new_profile(state: &mut State, profile: Profileinput) -> String {
    let principal_id = api::caller();
   
    if state.user_profile.contains_key(&principal_id) {
        return "User already registered".to_string();
    }
   
    if !profile.email_id.contains("@") || !profile.email_id.contains(".") {
        return "Enter correct Emailid".to_string();
    }
    let new_profile = UserProfile {
        user_id: principal_id,
        email_id: profile.email_id,
        profile_img: profile.profile_img,
        username: profile.username,
        dao_ids: Vec::new(),
    };
    
    
    state.user_profile.insert(principal_id, new_profile);
    
    return "user registered successfully".to_string();
}


pub fn get_user_profile(state: &State) -> UserProfile {
    let principal_id = api::caller();
    if !state.user_profile.contains_key(&principal_id) {
        return UserProfile {
            user_id: principal_id,
            email_id: String::new(),
            profile_img: Vec::new(),
            username: String::new(),
            dao_ids: Vec::new(),
        };
    }
    state.user_profile.get(&principal_id).unwrap().clone()
}

pub fn update_profile(state: &mut State, profile: Profileinput) -> String {
    let principal_id = api::caller();
    if !state.user_profile.contains_key(&principal_id) {
        return "User not registered".to_string();
    }
    if !profile.email_id.contains("@") || !profile.email_id.contains(".") {
        return "Enter correct Emailid".to_string();
    }
    let old_profile = state.user_profile.get(&principal_id).unwrap().clone();
    let new_profile = UserProfile {
        user_id: principal_id,
        email_id: profile.email_id,
        profile_img: profile.profile_img,
        username: profile.username,
        dao_ids: old_profile.dao_ids, // This is your old list of daoIds
    };
    state.user_profile.insert(principal_id, new_profile);
    return "user updated successfully".to_string();
}

pub fn delete_profile(state: &mut State) -> String {
    let principal_id = api::caller();
    if!state.user_profile.contains_key(&principal_id) {
        return "User not registered".to_string();
    }
    state.user_profile.remove(&principal_id);
    return "user deleted successfully".to_string();
}

// pub async fn create_dao(state: &mut State, dao_detail: DaoInput)->String {
//     let principal_id = api::caller();
//     if !state.user_profile.contains_key(&principal_id) {
//         return "User not registered".to_string();
//     }
//     let user_profile = state.user_profile.get(&principal_id).unwrap().clone();
    
//     // Create a new runtime to run the async function
//     // let rt = tokio::runtime::Runtime::new().unwrap();
//     // Block on the async function
//     let arg=CreateCanisterArgument{
//         settings: None,
//     };
//     // let canister_id = rt.block_on(create_canister(arg));
//     // let canister_id=create_canister(arg).await;
//     // Print the result
//     // println!("Canister ID: {:?}", canister_id);
    
//     return "DAO created successfully".to_string();
// }

// async fn create_canister(
//     arg: CreateCanisterArgument,
//     // cycles: u128,
// ) -> CallResult<(CanisterIdRecord,)> {
//     let extended_arg = CreateCanisterArgumentExtended {
//         settings: arg.settings,
//         sender_canister_version: Some(canister_version()),
//     };
//     let cycles: u128 = 100_000_000_000;
//     call_with_payment128(
//         Principal::management_canister(),
//         "create_canister",
//         (extended_arg,),
//         cycles,
//     )
//     .await
// }