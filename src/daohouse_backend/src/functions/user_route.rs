use std::borrow::Borrow;

use crate::api::call::{call_with_payment128, CallResult};
use crate::api::canister_version;
use crate::routes::upload_image;
use crate::types::{
    CanisterIdRecord, CanisterInstallMode, CreateCanisterArgument, CreateCanisterArgumentExtended,
    InstallCodeArgument, InstallCodeArgumentExtended,
};
use crate::types::{DaoInput, Profileinput, UserProfile};
use crate::{guards::*, DaoCanisterInput};
use crate::{routes, with_state, DaoDetails, DaoResponse, ImageData};
use candid::{encode_one, Principal};
use ic_cdk::api;
use ic_cdk::println;
use ic_cdk::{query, update};
use serde_bytes::ByteBuf;
// use ic_cdk::trap;

#[update(guard=prevent_anonymous)]
async fn create_profile(// asset_handler_canister_id: String,
    // profile: Profileinput
) -> Result<(), String> {
    // Validate email format
    // if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
    //     return Err("Enter correct Email ID".to_string());
    // }
    let principal_id = api::caller();

    // Check if the caller is anonymous
    if principal_id == Principal::anonymous() {
        return Err("Anonymous principal not allowed to make calls.".to_string());
    }

    // Check if the user is already registered
    // let is_registered = with_state(|state| {
    //     if state.user_profile.contains_key(&principal_id) {
    //         return Err("User already registered".to_string());
    //     }
    //     Ok(())
    // }).is_err();

    // if is_registered {
    //     return Err("User already exist".to_string());
    // }

    // image upload
    // let image_id = upload_image(asset_handler_canister_id, ImageData {
    //     content: profile.image_content,
    //     name: profile.image_title.clone(),
    //     content_type: profile.image_content_type.clone(),
    // }).await.map_err(|err| format!("Image upload failed: {}", err))?;

    let new_profile = UserProfile {
        user_id: principal_id,
        email_id: "".to_string(),
        profile_img: "1".to_string(),
        username: "".to_string(),
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
    };

    // with_state(|state| routes::create_new_profile(state, profile.clone()))

    with_state(|state| -> Result<(), String> {
        let mut analytics = state.analytics_content.borrow().get(&0).unwrap();
        analytics.members_count += 1;
        state.analytics_content.insert(0, analytics);
        state.user_profile.insert(principal_id, new_profile);
        Ok(())
    })
}

#[query(guard = prevent_anonymous)]
fn get_my_follower() -> Result<Vec<Principal>, String> {
    // let principal_id = api::caller();

    let followers =
        with_state(|state| state.user_profile.get(&api::caller()).clone()).expect("User not found");
    Ok(followers.followers_list)
}

#[query(guard = prevent_anonymous)]
fn get_my_following() -> Result<Vec<Principal>, String> {
    // let principal_id = api::caller();

    let following: UserProfile =
        with_state(|state| state.user_profile.get(&api::caller()).clone()).expect("User not found");
    Ok(following.followings_list)
}

#[query(guard = prevent_anonymous)]
async fn get_user_profile() -> Result<UserProfile, String> {
    with_state(|state| routes::get_user_profile(state))
}

#[update(guard = prevent_anonymous)]
async fn update_profile(
    asset_handler_canister_id: String,
    profile: Profileinput,
) -> Result<(), String> {
    if !profile.email_id.contains('@') || !profile.email_id.contains('.') {
        return Err("Enter correct Email ID".to_string());
    }

    let principal_id = api::caller();

    // Check if the user is already registered
    let is_registered = with_state(|state| {
        if !state.user_profile.contains_key(&principal_id) {
            return Err("User is not registered".to_string());
        }
        Ok(())
    })
    .is_err();

    if is_registered {
        return Err("User dosen't exist ".to_string());
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
            asset_handler_canister_id,
            ImageData {
                content: profile.image_content,
                name: profile.image_title.clone(),
                content_type: profile.image_content_type.clone(),
            },
        )
        .await
        .map_err(|err| format!("Image upload failed: {}", err))?;
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

#[update(guard = prevent_anonymous)]
async fn follow_user(userid: Principal) -> Result<(), String> {
    let principal_id = api::caller();

    if !with_state(|state| state.user_profile.contains_key(&principal_id)) {
        return Err("User not registered".to_string());
    }

    let getuser = with_state(|state| state.user_profile.get(&principal_id).unwrap().clone());

    if getuser.followers_list.contains(&principal_id) {
        return Err("You have already followed this user".to_string());
    }

    let updated_followers_count = getuser.followers_count + 1;
    let mut updated_list = getuser.followers_list.clone();
    updated_list.push(principal_id);

    let update_user = UserProfile {
        user_id: getuser.user_id,
        email_id: getuser.email_id,
        profile_img: getuser.profile_img,
        username: getuser.username,
        dao_ids: getuser.dao_ids,
        post_count: getuser.post_count,
        post_id: getuser.post_id,
        followers_count: updated_followers_count,
        followers_list: updated_list,
        followings_count: getuser.followings_count,
        followings_list: getuser.followings_list,
        description: getuser.description,
        tag_defines: getuser.tag_defines,
        contact_number: getuser.contact_number,
        twitter_id: getuser.twitter_id,
        telegram: getuser.telegram,
        website: getuser.website,
    };

    let getuser2 = with_state(|state| state.user_profile.get(&userid).unwrap().clone());

    let updated_following_count = getuser2.followings_count + 1;
    let mut updated_list2 = getuser2.followings_list.clone();
    updated_list2.push(principal_id);

    let updateuser2 = UserProfile {
        user_id: getuser2.user_id,
        email_id: getuser2.email_id,
        profile_img: getuser2.profile_img,
        username: getuser2.username,
        dao_ids: getuser2.dao_ids,
        post_count: getuser2.post_count,
        post_id: getuser2.post_id,
        followers_count: getuser2.followers_count,
        followers_list: getuser2.followings_list,
        followings_count: updated_following_count,
        followings_list: updated_list2,
        description: getuser2.description,
        tag_defines: getuser2.tag_defines,
        contact_number: getuser2.contact_number,
        twitter_id: getuser2.twitter_id,
        telegram: getuser2.telegram,
        website: getuser2.website,
    };

    with_state(|state| state.user_profile.insert(principal_id, update_user));
    with_state(|state| state.user_profile.insert(userid, updateuser2));

    Ok(())
}

#[update(guard = prevent_anonymous)]
pub async fn create_dao(canister_id: String, dao_detail: DaoInput) -> Result<String, String> {
    ic_cdk::println!("value is {:?}", dao_detail);
    let principal_id = api::caller();
    // if principal_id == Principal::anonymous() {
    //     // trap("Anonymous principal not allowed to make calls.")
    //     return Err("Anonymo
    //     us principal not allowed to make calls."
    //         .to_string());
    // }

    // add cycles from user

    // let result: Result<(), String> = call_with_payment(api::id(), "deposit_cycles", (), 10_000_000_000, ).await;

    let mut updated_members = dao_detail.members.clone();
    updated_members.push(principal_id.clone());

    // image upload

    let image_id: Result<String, String> = upload_image(
        canister_id,
        ImageData {
            content: dao_detail.image_content,
            name: dao_detail.image_title,
            content_type: dao_detail.image_content_type,
        },
    )
    .await;

    let mut id = String::new();
    let image_create_res: bool = (match image_id {
        Ok(value) => {
            id = value;
            Ok(())
        }
        Err(er) => {
            ic_cdk::println!("error {}", er.to_string());
            Err(())
        }
    })
    .is_err();

    if image_create_res {
        return Err("Image upload failed".to_string());
    }

    // let image_id = upload_image(canister_id, ImageData {
    //     content: dao_detail.image_content,
    //     name: dao_detail.image_title.clone(),
    //     content_type: dao_detail.image_content_type.clone(),
    // }).await.map_err(|err| format!("Image upload failed: {}", err))?;

    let update_dau_detail = DaoCanisterInput {
        dao_name: dao_detail.dao_name.clone(),
        purpose: dao_detail.purpose,
        daotype: dao_detail.daotype,
        link_of_document: dao_detail.link_of_document,
        cool_down_period: dao_detail.cool_down_period,
        members: updated_members,
        tokenissuer: dao_detail.tokenissuer,
        linksandsocials: dao_detail.linksandsocials,
        required_votes: dao_detail.required_votes,
        followers: vec![api::caller()],
        image_id: id.clone(),
        members_permissions: dao_detail.members_permissions,
    };

    let dao_detail_bytes: Vec<u8> = match encode_one(&update_dau_detail) {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err(format!("Failed to serialize DaoInput: {}", e));
        }
    };
    // if with_state(|state| state.user_profile.contains_key(&principal_id)).await {
    //     return Err("User not registered".to_string());
    // }

    // let user_detail=with_state(|state| state.user_profile.get(&principal_id));

    // let mut user_profile_detail =  with_state(|state| state.user_profile.get(&principal_id).unwrap().clone());

    let user_profile_detail = with_state(|state| state.user_profile.get(&principal_id).clone());

    let mut user_profile_detail = match user_profile_detail {
        Some(data) => data,
        None => panic!("User profile doesn't exist !"),
    };
    let arg = CreateCanisterArgument { settings: None };
    let (canister_id,) = match create_canister(arg).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            return Err(err_string);
        }
    };
    // let (id,)=canister_id;
    let _addcycles = deposit_cycles(canister_id, 100000000).await;

    let canister_id_principal = canister_id.canister_id;

    println!("Canister ID: {}", canister_id_principal.to_string());

    let dao_details: DaoDetails = DaoDetails {
        dao_canister_id: canister_id_principal.to_string().clone(),
        dao_name: dao_detail.dao_name,
        image_id: id,
        dao_id: canister_id_principal.clone(),
    };

    with_state(|state| {
        state
            .dao_details
            .insert(canister_id_principal.to_string().clone(), dao_details)
    });

    user_profile_detail
        .dao_ids
        .push(canister_id_principal.to_string());

    // let new_profile = UserProfile {
    //     user_id: user_profile_detail.user_id,
    //     email_id: user_profile_detail.email_id,
    //     profile_img: user_profile_detail.profile_img,
    //     username: user_profile_detail.username,
    //     dao_ids: user_profile_detail.dao_ids,
    //     post_count: user_profile_detail.post_count,
    //     post_id: user_profile_detail.post_id,
    //     followers_count: user_profile_detail.followers_count,
    //     followers_list:user_profile_detail.followers_list,
    //     followings_count: user_profile_detail.followings_count,
    //     followings_list: user_profile_detail.followings_list,
    //     description: user_profile_detail.description,
    //     tag_defines: user_profile_detail.tag_defines,
    //     contact_number: user_profile_detail.contact_number,
    //     twitter_id: user_profile_detail.twitter_id,
    //     telegram: user_profile_detail.telegram,
    //     website: user_profile_detail.website,
    // };

    with_state(|state| {
        let mut analytics = state.analytics_content.borrow().get(&0).unwrap();
        analytics.dao_counts += 1;
        state.analytics_content.insert(0, analytics);
        state.user_profile.insert(principal_id, user_profile_detail)
    });
    let arg1 = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
        wasm_module: vec![],
        arg: dao_detail_bytes,
    };
    let _installcode = install_code(arg1).await;
    println!("Canister ID: {:?}", canister_id);
    Ok("DAO created successfully".to_string())
}

async fn create_canister(
    arg: CreateCanisterArgument, // cycles: u128,
) -> CallResult<(CanisterIdRecord,)> {
    let extended_arg = CreateCanisterArgumentExtended {
        settings: arg.settings,
        sender_canister_version: Some(canister_version()),
    };
    let cycles: u128 = 100_000_000_000;
    call_with_payment128(
        Principal::management_canister(),
        "create_canister",
        (extended_arg,),
        cycles,
    )
    .await
}

async fn deposit_cycles(arg: CanisterIdRecord, cycles: u128) -> CallResult<()> {
    call_with_payment128(
        Principal::management_canister(),
        "deposit_cycles",
        (arg,),
        cycles,
    )
    .await
}

async fn install_code(arg: InstallCodeArgument) -> CallResult<()> {
    // let wasm_base64: &str = "3831fb07143cd43c3c51f770342d2b7d0a594311529f5503587bf1544ccd44be";
    // let wasm_module_sample: Vec<u8> = base64::decode(wasm_base64).expect("Decoding failed");

    // let wasm_module_sample: Vec<u8> = include_bytes!("../../../../target/wasm32-unknown-unknown/debug/dao_canister.wasm").to_vec();

    let wasm_module_sample: Vec<u8> =
        include_bytes!("../../../../.dfx/local/canisters/dao_canister/dao_canister.wasm").to_vec();

    let cycles: u128 = 10_000_000_000;

    let extended_arg = InstallCodeArgumentExtended {
        mode: arg.mode,
        canister_id: arg.canister_id,
        wasm_module: wasm_module_sample,
        arg: arg.arg,
        sender_canister_version: Some(canister_version()),
    };

    call_with_payment128(
        Principal::management_canister(),
        "install_code",
        (extended_arg,),
        cycles,
    )
    .await
}

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
    let principal_id = api::caller();
    if principal_id == Principal::anonymous() {
        return Err("Anonymous user not allowed".to_string());
    }

    with_state(|state| {
        let user = state.user_profile.contains_key(&principal_id);
        if user {
            Ok("User exist ".to_string())
        } else {
            Err("User does not exist".to_string())
        }
    })
}

#[update]
pub async fn get_dao_details(dao_canister_id: String) -> String {
    ic_cdk::println!("inside this function: {}", &dao_canister_id);

    type ReturnResult = DaoResponse;

    // let principal = match Principal::from_text(&dao_canister_id) {
    //     Ok(p) => p,
    //     Err(e) => {
    //         ic_cdk::println!("Invalid principal: {}", e);
    //         return "Invalid principal".to_string();
    //     }
    // };

    let principal = Principal::from_text(&dao_canister_id).unwrap();

    ic_cdk::println!("principal id is {:?} ", &principal);

    let response: CallResult<(ReturnResult,)> = ic_cdk::call(principal, "get_dao_detail", ()).await;

    match response {
        Ok((dao_response,)) => {
            ic_cdk::println!("DAO response: {:?}", dao_response);
            // Return the DAO response or any other appropriate data
            "DAO details fetched successfully".to_string()
        }
        Err((rejection_code, message)) => {
            ic_cdk::println!(
                "Call failed with code {:?} and message {:?}",
                rejection_code,
                message
            );
            "Call failed".to_string()
        }
    }
}
