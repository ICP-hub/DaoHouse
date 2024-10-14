use crate::{with_state, ProposalValueStore, State};

use crate::types::{Profileinput, UserProfile};
use candid::Principal;
use ic_cdk::api;

// pub fn create_new_profile_controller(
//     state: &mut State,
//     profile: Profileinput,
// ) -> Result<(), String> {
//     let principal_id = api::caller();

//     // Check if the user is already registered
//     if state.user_profile.contains_key(&principal_id) {
//         return Err(String::from("User already registered"));
//     }

//     // Validate email format
//     if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
//         return Err(String::from("Invalid email format"));
//     }

//     // Construct a new UserProfile object
//     let new_profile = UserProfile {
//         user_id: principal_id,
//         email_id: profile.email_id,
//         profile_img: profile.profile_img,
//         image_canister: asset_canister_id,
//         username: profile.username,
//         dao_ids: Vec::new(),
//         post_count: 0,
//         post_id: Vec::new(),
//         followers_count: 0,
//         followers_list: Vec::new(),
//         followings_count: 0,
//         followings_list: Vec::new(),
//         description: profile.description,
//         tag_defines: profile.tag_defines,
//         contact_number: profile.contact_number,
//         twitter_id: profile.twitter_id,
//         telegram: profile.telegram,
//         website: profile.website,
//     };

//     // Insert the new profile into the state
//     state.user_profile.insert(principal_id, new_profile);

//     // updating analytics
//     match state.analytics_content.borrow_mut().get(&0) {
//         Some(mut analytics) => {
//             analytics.members_count += 1;
//         }
//         None => {
//             ic_cdk::println!("Getting analytics failed in user creation.")
//         }
//     }

//     Ok(())
// }

pub fn get_user_profile(state: &State) -> Result<UserProfile, String> {
    let principal_id = api::caller();

    let user_submitted_proposals : u64  = state.proposal_store.iter().filter(|(_key, proposal)| proposal.created_by == principal_id).count().try_into().unwrap();

    if principal_id == Principal::anonymous() {
        Err("Anonymous principal not allowed to make calls.".to_string())
    } else if let Some(profile) = state.user_profile.get(&principal_id) {
        let mut user_profile: UserProfile = profile.clone();
        user_profile.submitted_proposals = user_submitted_proposals;
        Ok(user_profile)

    } else {
        Err("User profile not found".to_string())
    }
}

pub fn update_profile(state: &mut State, profile: Profileinput) -> Result<(), String> {
    let principal_id = api::caller();

    // Check if the caller is anonymous
    if principal_id == Principal::anonymous() {
        return Err("Anonymous principal not allowed to make calls.".to_string());
    }

    // Check if the user is registered
    if !state.user_profile.contains_key(&principal_id) {
        return Err("User not registered".to_string());
    }

    // Validate email format
    if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
        return Err("Enter correct Email ID".to_string());
    }

    // Clone the old profile and update the fields with new information
    let mut new_profile = state.user_profile.get(&principal_id).unwrap().clone();
    new_profile.email_id = profile.email_id;
    new_profile.profile_img = profile.profile_img;
    new_profile.username = profile.username;
    new_profile.description = profile.description;
    new_profile.contact_number = profile.contact_number;
    new_profile.twitter_id = profile.twitter_id;
    new_profile.telegram = profile.telegram;
    new_profile.website = profile.website;

    // Replace the old profile with the updated one
    state.user_profile.insert(principal_id, new_profile);

    Ok(())
}

pub fn delete_profile(state: &mut State) -> Result<(), String> {
    let principal_id = api::caller();

    // Check if the user is registered
    if !state.user_profile.contains_key(&principal_id) {
        return Err("User not registered".to_string());
    }

    // Remove the user profile
    state.user_profile.remove(&principal_id);

    Ok(())
}
