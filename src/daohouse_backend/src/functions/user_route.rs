use crate::api::call::{call, call_with_payment128, CallResult};
use crate::api::canister_version;
use std::borrow::Borrow;
use std::sync::mpsc;
use std::thread;

use crate::routes::{create_dao_canister, create_new_ledger_canister, upload_image};
use crate::types::{
    CanisterIdRecord, CanisterInstallMode, CreateCanisterArgument, CreateCanisterArgumentExtended,
    InstallCodeArgument, InstallCodeArgumentExtended,
};

use crate::types::{DaoInput, Profileinput, UserProfile};
use crate::{
    guards::*, Account, ArchiveOptions, CanisterData, CanisterSettings, DaoCanisterInput,
    FeatureFlags, ICRC1LedgerInitArgs, InitArgs, LedgerArg, LedgerCanisterId, MinimalProfileinput,
};
use crate::{routes, with_state, DaoDetails, DaoResponse, ImageData};
use candid::{arc, encode_one, Encode, Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::{self, RejectionCode};
// use ic_cdk::api::management_canister::main::CanisterSettings;
use ic_cdk::println;
use ic_cdk::{query, update};
// use crate::functions::cani
// use icrc_ledger_types::icrc1::account::Account;

use super::canister_functions::call_inter_canister;
use super::ledger_functions::create_ledger_canister;
use super::reverse_canister_creation;
// use ic_cdk::trap;

#[update(guard=prevent_anonymous)]
async fn create_profile(profile: MinimalProfileinput) -> Result<String, String> {
    // Validate email format
    if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
        return Err(String::from(crate::utils::INVALID_EMAIL));
    }
    let principal_id = api::caller();

    // Check if the user is already registered
    let is_registered = with_state(|state| {
        if state.user_profile.contains_key(&principal_id) {
            return Err(crate::utils::USER_REGISTERED);
        }
        Ok(())
    })
    .is_err();
    if is_registered {
        return Err(String::from(crate::utils::USER_REGISTERED));
    }

    // to upload image
    let image_id = upload_image(ImageData {
        content: profile.image_content,
        name: profile.image_title.clone(),
        content_type: profile.image_content_type.clone(),
    })
    .await
    .map_err(|err| format!("{}{}", crate::utils::IMAGE_UPLOAD_FAILED, err))?;

    // getting image canister id
    let asset_canister_id = with_state(|state| {
        Ok(match state.canister_data.get(&0) {
            Some(val) => val.ic_asset_canister,
            None => return Err(String::from(crate::utils::CANISTER_DATA_NOT_FOUND)),
        })
    })
    .map_err(|err| format!("Error: {}", err))
    .unwrap();

    let new_profile = UserProfile {
        user_id: principal_id,
        email_id: profile.email_id,
        profile_img: image_id,
        username: profile.name,
        dao_ids: Vec::new(),
        post_count: 0,
        post_id: Vec::new(),
        followers_count: 0,
        followers_list: Vec::new(),
        followings_count: 0,
        followings_list: Vec::new(),
        description: "".to_string(),
        tag_defines: Vec::new(),
        contact_number: "".to_string(),
        twitter_id: "".to_string(),
        telegram: "".to_string(),
        website: "".to_string(),
        image_canister: asset_canister_id,
        follow_dao : Vec::new(),
        join_dao :  Vec::new(),
        submitted_proposals : 0,
    };

    // with_state(|state| routes::create_new_profile(state, profile.clone()))

    with_state(|state| -> Result<String, String> {
        let mut analytics = state.analytics_content.borrow().get(&0).unwrap();
        analytics.members_count += 1;
        state.analytics_content.insert(0, analytics);
        state.user_profile.insert(principal_id, new_profile);
        Ok(String::from(crate::utils::PROFILE_UPDATE_SUCCESS))
    })
}

// #[query(guard = prevent_anonymous)]
// fn get_my_follower() -> Result<Vec<Principal>, String> {
//     // let principal_id = api::caller();

//     let followers =
//         with_state(|state| state.user_profile.get(&api::caller()).clone()).expect("User not found");
//     Ok(followers.followers_list)
// }

// #[query(guard = prevent_anonymous)]
// fn get_my_following() -> Result<Vec<Principal>, String> {
//     // let principal_id = api::caller();

//     let following: UserProfile =
//         with_state(|state| state.user_profile.get(&api::caller()).clone()).expect("User not found");
//     Ok(following.followings_list)
// }

#[query(guard = prevent_anonymous)]
async fn get_user_profile() -> Result<UserProfile, String> {
    with_state(|state| routes::get_user_profile(state))
}

#[update(guard = prevent_anonymous)]
async fn update_profile(
    // asset_handler_canister_id: String,
    profile: Profileinput,
) -> Result<(), String> {
    if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
        return Err(String::from(crate::utils::INVALID_EMAIL));
    }

    let principal_id = api::caller();

    // Check if the user is already registered
    let is_registered = with_state(|state| {
        if !state.user_profile.contains_key(&principal_id) {
            return Err(String::from(crate::utils::USER_REGISTERED));
        }
        Ok(())
    })
    .is_err();

    if is_registered {
        return Err(String::from(crate::utils::USER_DOES_NOT_EXIST));
    }
    // let is_registered = with_state(|state| {
    //     if !state.user_profile.contains_key(&principal_id) {
    //         return Err("User is not registered".to_string());
    //     }
    //     Ok(())
    // }).is_err();

    // if !is_registered {
    //     return Err("User dosen't exist ".to_string());
    // }
    // Validate email format

    let mut image_id: String = profile.profile_img.to_string();

    if profile.image_title != "na".to_string() {
        image_id = upload_image(
            // asset_handler_canister_id,
            ImageData {
                content: profile.image_content,
                name: profile.image_title.clone(),
                content_type: profile.image_content_type.clone(),
            },
        )
        .await
        .map_err(|_err| crate::utils::IMAGE_UPLOAD_FAILED)?;
    }

    // image upload

    // Clone the old profile and update the fields with new information

    with_state(|state| {
        let mut new_profile = state.user_profile.get(&principal_id).unwrap().clone();
        new_profile.email_id = profile.email_id;
        new_profile.profile_img = image_id;
        new_profile.username = profile.username;
        new_profile.description = profile.description;
        new_profile.contact_number = profile.contact_number;
        new_profile.twitter_id = profile.twitter_id;
        new_profile.telegram = profile.telegram;
        new_profile.website = profile.website;
        new_profile.tag_defines = profile.tag_defines;

        state.user_profile.insert(principal_id, new_profile);
    });

    Ok(())

    // with_state(|state| routes::update_profile(state, profile.clone()))
}

#[update(guard = prevent_anonymous)]
async fn delete_profile() -> Result<(), String> {
    with_state(|state| routes::delete_profile(state))
}

// #[update(guard = prevent_anonymous)]
// fn follow_user(user_id: Principal) -> Result<String, String> {
//     let my_principal_id = api::caller();
//     with_state(|state| {
//         let my_profile_response = match &mut state.user_profile.get(&api::caller()) {
//             Some(profile) => {
//                 if !profile.followings_list.contains(&user_id) {
//                     profile.followings_list.push(user_id);
//                     profile.followings_count += 1;
//                     state
//                         .user_profile
//                         .insert(my_principal_id, profile.to_owned());
//                     Ok(())
//                 } else {
//                     Err(String::from("You are already following the user"))
//                 }
//             }
//             None => Err(String::from("user does not exist")),
//         };
//         let other_person_response = match &mut state.user_profile.get(&user_id) {
//             Some(profile) => {
//                 profile.followers_list.push(my_principal_id);
//                 profile.followers_count += 1;
//                 state.user_profile.insert(user_id, profile.to_owned());
//                 Ok(())
//             }
//             None => Err(String::from("Operation failed")),
//         };
//         match (my_profile_response, other_person_response) {
//             (Ok(()), Ok(())) => Ok(String::from("Successfully followed")),
//             (Err(e), _) | (_, Err(e)) => Err(e),
//         }
//     })
//     // Ok("()".to_string())
// }

#[update(guard = prevent_anonymous)]
pub async fn create_dao(dao_detail: DaoInput) -> Result<String, String> {
    // Note: This method follows approach of transaction.

    // getting user account
    let principal_id = ic_cdk::api::caller();
    let user_profile_detail = with_state(|state| state.user_profile.get(&principal_id).clone());

    let mut user_profile_detail = match user_profile_detail {
        Some(data) => data,
        None => return Err(String::from(crate::utils::USER_DOES_NOT_EXIST)),
    };

    // to create dao canister
    let dao_canister_id = create_dao_canister(dao_detail.clone())
        .await
        .map_err(|err| format!("{} {}", crate::utils::CREATE_DAO_CANISTER_FAIL, err))?;

    // to create ledger canister
    let ledger_canister_id = create_new_ledger_canister(dao_detail.clone(), dao_canister_id).await;

    let res = match ledger_canister_id {
        Ok(val) => Ok(val),

        Err(err) => {
            let _ = reverse_canister_creation(CanisterIdRecord {
                canister_id: dao_canister_id,
            })
            .await;

            Err(format!("{} {}", crate::utils::CREATE_LEDGER_FAILURE, err))
        }
    }
    .map_err(|err| format!("Error {}", err));

    let ledger_canister_id = res.map_err(|err| format!("Error in ledger canister id: {}", err))?;

    let dao_details: DaoDetails = DaoDetails {
        dao_canister_id: dao_canister_id.clone(),
        dao_name: dao_detail.dao_name,
        dao_desc: dao_detail.purpose,
        dao_associated_ledger: ledger_canister_id,
    };

    // storing dao details for DAO listings
    with_state(|state| {
        state
            .dao_details
            .insert(dao_canister_id.clone(), dao_details)
    });

    user_profile_detail.dao_ids.push(dao_canister_id);

    // adding ledger canister in newly created DAO canister
    match call_inter_canister::<LedgerCanisterId, ()>(
        "add_ledger_canister_id",
        LedgerCanisterId {
            id: ledger_canister_id,
        },
        dao_canister_id,
    )
    .await
    {
        Ok(()) => {}
        Err(err) => {
            //   delete created canisters
            let _ = reverse_canister_creation(CanisterIdRecord {
                canister_id: dao_canister_id,
            })
            .await;

            let _ = reverse_canister_creation(CanisterIdRecord {
                canister_id: ledger_canister_id,
            })
            .await;

            return Err(format!("{}{}", crate::utils::INTER_CANISTER_FAILED, err));
        }
    }

    // updating analytics
    with_state(|state| {
        let mut analytics = state.analytics_content.borrow().get(&0).unwrap();
        analytics.dao_counts += 1;
        state.analytics_content.insert(0, analytics);
        state.user_profile.insert(principal_id, user_profile_detail)
    });

    Ok(format!(
        "Dao created, canister id: {} ledger id: {}",
        dao_canister_id.to_string(),
        ledger_canister_id.to_string()
    ))
}

// async fn create_canister(
//     arg: CreateCanisterArgument, // cycles: u128,
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

// async fn deposit_cycles(arg: CanisterIdRecord, cycles: u128) -> CallResult<()> {
//     call_with_payment128(
//         Principal::management_canister(),
//         "deposit_cycles",
//         (arg,),
//         cycles,
//     )
//     .await
// }

// async fn install_code(arg: InstallCodeArgument) -> CallResult<()> {
//     // let wasm_base64: &str = "3831fb07143cd43c3c51f770342d2b7d0a594311529f5503587bf1544ccd44be";
//     // let wasm_module_sample: Vec<u8> = base64::decode(wasm_base64).expect("Decoding failed");

//     // let wasm_module_sample: Vec<u8> = include_bytes!("../../../../target/wasm32-unknown-unknown/debug/dao_canister.wasm").to_vec();

//     // let wasm_module_sample: Vec<u8> =
//     //     include_bytes!("../../../../.dfx/local/canisters/dao_canister/dao_canister.wasm").to_vec();

//     let mut wasm_module_sample: Vec<u8> = Vec::new();

//     with_state(|state| match state.wasm_module.get(&0) {
//         Some(val) => {
//             wasm_module_sample = val.wasm;
//         }
//         None => panic!("WASM error"),
//     });

//     let cycles: u128 = 100_000_000_000;

//     let extended_arg = InstallCodeArgumentExtended {
//         mode: arg.mode,
//         canister_id: arg.canister_id,
//         wasm_module: wasm_module_sample,
//         arg: arg.arg,
//         sender_canister_version: Some(canister_version()),
//     };

//     call_with_payment128(
//         Principal::management_canister(),
//         "install_code",
//         (extended_arg,),
//         cycles,
//     )
//     .await
// }

// get dao details (intercanister)
// #[query]
// pub async fn get_dao_details(dao_canister_id: String) -> String {

//     ic_cdk::println!("inside this function: {}", &dao_canister_id);

//     type ReturnResult = DaoResponse;

//     let response:  CallResult<(ReturnResult,)>  =
//     ic_cdk::call(Principal::from_text(dao_canister_id).unwrap(), "get_dao_detail", ()).await;

//   let res0: Result<(ReturnResult,), (RejectionCode, String)> = response;

//     ic_cdk::println!("response is  {:?}", res0);

//     "sdfs".to_string()
// }

// check user existance
#[query(guard = prevent_anonymous)]
fn check_user_existance() -> Result<String, String> {
    with_state(|state| {
        let user = state.user_profile.contains_key(&ic_cdk::api::caller());
        if user {
            Ok("User exist ".to_string())
        } else {
            Err(String::from(crate::utils::USER_DOES_NOT_EXIST))
        }
    })
}

// #[update]
// pub async fn get_dao_details(dao_canister_id: String) -> String {
//     ic_cdk::println!("inside this function: {}", &dao_canister_id);

//     type ReturnResult = DaoResponse;

//     // let principal = match Principal::from_text(&dao_canister_id) {
//     //     Ok(p) => p,
//     //     Err(e) => {
//     //         ic_cdk::println!("Invalid principal: {}", e);
//     //         return "Invalid principal".to_string();
//     //     }
//     // };

//     let principal = Principal::from_text(&dao_canister_id).unwrap();

//     ic_cdk::println!("principal id is {:?} ", &principal);

//     let response: CallResult<(ReturnResult,)> = ic_cdk::call(principal, "get_dao_detail", ()).await;

//     match response {
//         Ok((dao_response,)) => {
//             ic_cdk::println!("DAO response: {:?}", dao_response);
//             // Return the DAO response or any other appropriate data
//             "DAO details fetched successfully".to_string()
//         }
//         Err((rejection_code, message)) => {
//             ic_cdk::println!(
//                 "Call failed with code {:?} and message {:?}",
//                 rejection_code,
//                 message
//             );
//             "Call failed".to_string()
//         }
//     }
// }

// #[update(guard = prevent_anonymous)]
// fn is_user_registered(id: Principal) -> bool {
//     with_state(|state| state.user_profile.contains_key(&id))
// }

// #[update(guard = prevent_anonymous)]
// fn unfollow_user(user_principal: Principal) -> Result<String, String> {
//     let principal_id = api::caller();

//     with_state(|state| match &mut state.user_profile.get(&api::caller()) {
//         Some(user) => {
//             user.followers_list.retain(|s| s != &user_principal);
//             user.followings_count -= 1;

//             state.user_profile.insert(principal_id, user.to_owned());
//             Ok(String::from("Successfully unfollowed."))
//         }
//         None => Err(String::from("User does not exist")),
//     })
// }

// fn unfollow_user(user_principal: Principal) -> Result<String, String> {
//     let principal_id = api::caller();

//     with_state(|state| {
//         // Retrieve the caller's profile
//         let mut my_profile = match state.user_profile.get(&principal_id) {
//             Some(profile) => profile.clone(),
//             None => return Err(String::from("User does not exist")),
//         };

//         if my_profile.followings_list.contains(&user_principal) {
//             my_profile.followings_list.retain(|s| s != &user_principal);
//             my_profile.followings_count -= 1;
//         } else {
//             return Err(String::from("You are not following this user"));
//         }

//         // Update the caller's profile in the state
//         state.user_profile.insert(principal_id, my_profile);

//         // Retrieve the profile of the user being unfollowed
//         let mut other_profile = match state.user_profile.get(&user_principal) {
//             Some(profile) => profile.clone(),
//             None => return Err(String::from("Other user does not exist")),
//         };

//         other_profile.followers_list.retain(|s| s != &principal_id);
//         other_profile.followers_count -= 1;

//         // Update the profile of the user being unfollowed in the state
//         state.user_profile.insert(user_principal, other_profile);

//         Ok(String::from("Successfully unfollowed"))
//     })
// }

#[update(guard = prevent_anonymous)]
fn get_profile_by_id(id: Principal) -> Result<UserProfile, String> {
    let user_submitted_proposals : u64 = with_state(|state| {
        state.proposal_store
            .iter()
            .filter(|(_key, proposal)| proposal.created_by == id)
            .count()
    }).try_into().unwrap();

    with_state(|state| match state.user_profile.get(&id) {
        Some(profile) => {
            let mut user_profile: UserProfile = profile.clone();
            user_profile.submitted_proposals = user_submitted_proposals;
            Ok(user_profile)
        },
        None => Err(String::from(crate::utils::USER_DOES_NOT_EXIST)),
    })
}

// #[update]
pub async fn create_ledger(
    total_tokens: Nat,
    token_name: String,
    token_symbol: String,
    members: Vec<Principal>,
    dao_canister_id: Principal,
) -> Result<Principal, String> {
    let tokens_per_user = total_tokens.clone() / members.len();

    let mut accounts: Vec<(Account, Nat)> = vec![];

    for acc in members.iter() {
        let account = Account {
            owner: acc.to_owned(),
            subaccount: None,
        };

        accounts.push((account, tokens_per_user.clone()))
    }

    let ledger_args = LedgerArg::Init(InitArgs {
        token_name: token_name,
        token_symbol: token_symbol,
        minting_account: Account {
            owner: api::caller(),
            subaccount: None,
        },
        transfer_fee: Nat::from(0 as u32),
        metadata: vec![],
        // initial_balances: accounts,
        initial_balances :  vec![(
            Account {
                owner: dao_canister_id,
                subaccount: None,
            },
            total_tokens,
        )],
        // initial_balances: vec![
        //     // (
        //     //     Account {
        //     //         owner: api::caller(),
        //     //         subaccount: None,
        //     //     },
        //     //     Nat::from(1000000 as u32),
        //     // ),
        //     // (
        //     //     Account {
        //     //         owner: acc,
        //     //         subaccount: None,
        //     //     },
        //     //     Nat::from(290999 as u32),
        //     // ),
        // ],
        archive_options: ArchiveOptions {
            controller_id: api::caller(), // TODO: FIX THIS, THIS NEED TO BE DAO CANISTER ID
            // controller_id: Principal::from_text(dao_canister_id).map_err(|err| err.to_string())?,
            cycles_for_archive_creation: None,
            max_message_size_bytes: None,
            max_transactions_per_response: None,
            node_max_memory_size_bytes: None,
            num_blocks_to_archive: 100,
            trigger_threshold: 100,
        },
        feature_flags: Some(FeatureFlags { icrc2: true }),
        fee_collector_account: None,
        accounts_overflow_trim_quantity: None,
        maximum_number_of_accounts: None,
        decimals: None,

        max_memo_length: None,
    });

    create_ledger_canister(ledger_args).await

    // Ok("()".to_string())
}

// TODO REMOVE THIS
#[query(guard = prevent_anonymous)]
fn get_canister_meta_data() -> Result<CanisterData, String> {
    with_state(|state| match state.canister_data.get(&0) {
        Some(val) => Ok(val),
        None => return Err(String::from(crate::utils::CANISTER_DATA_NOT_FOUND)),
    })
    // with_state(|state| state.canister_data)
}

// TODO delete canister
// #[update]
// pub async fn delete(canister_id: Principal) -> Result<(), String>{

//     let arg = CanisterIdRecord {
//         canister_id: canister_id
//     };

//     call(Principal::management_canister(), "delete_canister", (arg,)).await;

//     Ok(())
// }

// BACKUP
// async fn create_ledger(dao_canister_id: String, total_tokens: Nat, acc: Principal, token_name: String, token_symbol: String) -> Result<String, String> {
//     let ledger_args = LedgerArg::Init(InitArgs {
//         token_name: String::from("BHANU"),
//         token_symbol: String::from("BRO"),
//         minting_account: Account {
//             owner: api::caller(),
//             subaccount: None,
//         },
//         transfer_fee: Nat::from(0 as u32),
//         metadata: vec![],
//         initial_balances: vec![(
//             Account {
//                 owner: api::caller(),
//                 subaccount: None,
//             },
//             Nat::from(1000000 as u32),
//         ),
//         (
//             Account {
//                 owner: acc,
//                 subaccount: None,
//             },
//             Nat::from(290999 as u32),
//         ),
//         ],
//         archive_options: ArchiveOptions {
//             // controller_id: api::caller(),
//             controller_id: Principal::from_text(dao_canister_id).map_err(|err| err.to_string())?,
//             cycles_for_archive_creation: None,
//             max_message_size_bytes: None,
//             max_transactions_per_response: None,
//             node_max_memory_size_bytes: None,
//             num_blocks_to_archive: 100,
//             trigger_threshold: 100,
//         },
//         feature_flags: Some(FeatureFlags { icrc2: true }),
//         fee_collector_account: None,
//         accounts_overflow_trim_quantity: None,
//         maximum_number_of_accounts: None,
//         decimals: None,

//         max_memo_length: None,
//     });

//     ic_cdk::println!("ledger canister args are {:?}", ledger_args);

//     create_ledger_canister(ledger_args).await

//     // Ok("()".to_string())
// }

#[query(guard = prevent_anonymous)]
async fn check_profile_existence() -> Result<(), String> {
    let principal_id = api::caller();
    let profile = with_state(|state| state.user_profile.get(&principal_id));

    if let Some(user_profile) = profile {
        if !user_profile.email_id.trim().is_empty() {
            return Err(crate::utils::USER_REGISTERED.to_string());
        }
    }
    Ok(())
}
