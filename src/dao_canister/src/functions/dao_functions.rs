use crate::{
    guards::*, AddMemberArgs, BountyDone, BountyRaised, ChangeDaoConfigArg, ChangeDaoPolicy,
    CreateGeneralPurpose, CreatePoll, DaoGroup, LedgerCanisterId, ProposalInput,
    RemoveDaoMemberArgs, RemoveMemberArgs, TokenTransferPolicy, UpdateDaoSettings,
};
use crate::{with_state, ProposalType};
use candid::Principal;
use ic_cdk::api;
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk::{query, update};

#[query]
async fn get_members_of_group(group: String) -> Result<Vec<Principal>, String> {
    with_state(|state| match state.dao_groups.get(&group) {
        Some(val) => Ok(val.group_members),
        None => Err(String::from(crate::utils::NOTFOUND_GROUP)),
    })
}

#[update(guard=guard_check_members)]
async fn proposal_to_add_member_to_group(args: AddMemberArgs) -> Result<String, String> {
    check_user_in_group(&args.group_name)?;

    let proposal = ProposalInput {
        principal_of_action: Some(args.new_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_ADD_MEMBER),
        proposal_type: ProposalType::AddMemberToGroupProposal,
        group_to_join: Some(args.group_name.clone()),
        new_dao_name: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: Some(ic_cdk::api::time()),
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        new_dao_type : None,
        group_to_remove : None,
    };

    with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&args.group_name) {
            if dao_group.group_members.contains(&args.new_member) {
                return Err(format!("Member already exist in this group"));
            }
        }
        Ok(())
    })?;

    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;

    Ok(String::from(crate::utils::REQUEST_ADD_MEMBER))
}

#[update(guard=guard_check_members)]
async fn proposal_to_remove_member_to_group(args: RemoveMemberArgs) -> Result<String, String> {
    check_user_and_member_in_group(&args.group_name, args.action_member)?;

    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_REMOVE_MEMBER),
        proposal_type: ProposalType::RemoveMemberToGroupProposal,
        group_to_remove : Some(args.group_name.clone()),
        new_dao_name: None,
        dao_purpose: None,
        group_to_join : None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: Some(ic_cdk::api::time()),
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        new_dao_type : None,
    };

    with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&args.group_name) {
            if !dao_group.group_members.contains(&args.action_member) {
                return Err(format!("Member does not exist in this group"));
            }
        }
        Ok(())
    })?;

    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::TITLE_DELETE_MEMBER))
}

#[update(guard=guard_check_members)]
async fn proposal_to_remove_member_to_dao(args: RemoveDaoMemberArgs) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_REMOVE_MEMBER),
        proposal_type: ProposalType::RemoveMemberToDaoProposal,
        group_to_join: None,
        new_dao_name: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        new_dao_type : None,
        group_to_remove : None,
    };

    with_state(|state| {
        if !state.dao.members.contains(&args.action_member) {
                return Err(format!("Member does not exist in this dao"));
        }
        Ok(())
    })?;

    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::TITLE_DELETE_MEMBER))
}

#[update(guard=guard_check_members)]
async fn proposal_to_chnage_dao_config(args: ChangeDaoConfigArg) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CHANGE_DAO_CONFIG),
        proposal_type: ProposalType::ChangeDaoConfig,
        new_dao_name: Some(args.dao_name),
        new_dao_type : Some(args.daotype),
        group_to_join: None,
        dao_purpose: Some(args.purpose),
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        group_to_remove : None,
    };
    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::MESSAGE_CHANGE_DAO_CONFIG))
}

#[update(guard=guard_check_members)]
async fn proposal_to_change_dao_policy(args: ChangeDaoPolicy) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CHANGE_DAO_POLICY),
        proposal_type: ProposalType::ChnageDaoPolicy,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        new_dao_type : None,
        group_to_remove : None,
        required_votes: Some(args.required_votes),
        cool_down_period : Some(args.cool_down_period),
    };
    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::MESSAGE_CHANGE_DAO_POLICY))
}

#[update(guard=guard_check_members)]
async fn proposal_to_transfer_token(args: TokenTransferPolicy) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_TOKEN_TRANSFER_POLICY),
        proposal_type: ProposalType::TokenTransfer,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from: Some(args.from),
        token_to : Some(args.to),
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        new_dao_type : None,
        group_to_remove : None,
    };
    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::MESSAGE_TOKEN_TRANSFER_POLICY))
}

#[update(guard=guard_check_members)]
async fn proposal_to_bounty_raised(args: BountyRaised) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_BOUNTY_RAISED),
        proposal_type: ProposalType::BountyRaised,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: Some(args.proposal_created_at),
        proposal_expired_at: Some(args.proposal_expired_at),
        bounty_task: Some(args.bounty_task),
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        group_to_remove : None,
        new_dao_type : None,
    };
    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::MESSAGE_BOUNTY_RAISED))
}

#[update(guard=guard_check_members)]
async fn proposal_to_bounty_done(args: BountyDone) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_BOUNTY_DONE),
        proposal_type: ProposalType::BountyRaised,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from:Some(args.from),
        token_to : Some(args.to),
        proposal_created_at: Some(args.proposal_created_at),
        proposal_expired_at: Some(args.proposal_expired_at),
        bounty_task: Some(args.bounty_task),
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        group_to_remove : None,
        new_dao_type : None,
    };
    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::MESSAGE_BOUNTY_DONE))
}

#[update(guard=guard_check_members)]
async fn proposal_to_create_poll(args: CreatePoll) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CREATE_POLL),
        proposal_type: ProposalType::Polls,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: Some(args.proposal_created_at),
        proposal_expired_at: Some(args.proposal_expired_at),
        bounty_task: None,
        poll_title: Some(args.poll_title),
        required_votes: None,
        cool_down_period : None,
        new_dao_type : None,
        group_to_remove : None,
    };
    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::MESSAGE_BOUNTY_DONE))
}

#[update(guard=guard_check_members)]
async fn proposal_to_create_general_purpose(args: CreateGeneralPurpose) -> Result<String, String> {
    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: args.purpose_title,
        proposal_type: ProposalType::GeneralPurpose,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: Some(args.proposal_created_at),
        proposal_expired_at: Some(args.proposal_expired_at),
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        new_dao_type : None,
        group_to_remove : None,
    };
    crate::proposal_route::create_proposal_controller(
        with_state(|state| state.dao.daohouse_canister_id),
        proposal,
    )
    .await;
    Ok(String::from(crate::utils::MESSAGE_GENERAL_PURPOSE_CREATED))
}

// #[update]
// async fn add_member_to_group(group: String, principal: Principal) -> String {
//     // let principal_id = api::caller();
//     // if principal_id == Principal::anonymous() {
//     //     return "Anonymous principal not allowed to make calls.".to_string();
//     // }

//     // let council_group = "council".to_string();

//     // let is_allowed = with_state(|state| {
//     //     state
//     //         .dao_groups
//     //         .get(&council_group)
//     //         .map_or(false, |group_list| group_list.users.contains(&principal_id))
//     // });

//     // if !is_allowed {
//     //     return format!(
//     //         "Caller with principal {:?} is not allowed to add members to group {}",
//     //         principal_id, group
//     //     );
//     // }

//     // let result =
//     //     with_state(|state| proposal_route::add_member_to_group(state, group.clone(), principal));
//     // result
//     "to".to_string()
// }

//
// #[update]
// async fn remove_member_from_group(group: String, principal: Principal) -> String {
//     let principal_id = api::caller();
//     if principal_id == Principal::anonymous() {
//         return "Anonymous principal not allowed to make calls.".to_string();
//     }

//     let council_group = "council".to_string();

//     let is_allowed = with_state(|state| {
//         state
//             .groups
//             .get(&council_group)
//             .map_or(false, |group_list| group_list.users.contains(&principal_id))
//     });

//     if !is_allowed {
//         return format!(
//             "Caller with principal {:?} is not allowed to remove members from group {}",
//             principal_id, group
//         );
//     }

//     let result = with_state(|state| {
//         proposal_route::remove_member_from_group(state, group.clone(), principal)
//     });
//     result
// }

// #[update(guard = prevent_anonymous)]
// fn join_dao() -> Result<String, String> {
//     let principal_id = api::caller();

//     with_state(|state| -> Result<String, String> {
//         if state.dao.members.contains(&principal_id) {
//             return Err("You are already member of this Dao".to_string());
//         }

//         let mut members = state.dao.members.clone();

//         members.push(principal_id.clone());

//         state.dao.members = members;
//         Ok("Successfully joined DAO".to_string())
//     })
// }

#[update (guard = prevent_anonymous)]
async fn ask_to_join_dao(daohouse_backend_id: Principal) -> Result<String, String> {
    crate::guards::guard_check_if_proposal_exists(
        api::caller(),
        ProposalType::AddMemberToDaoProposal,
    )?;

    with_state(|state| {
        if state.dao.members.contains(&api::caller()) {
                return Err(format!("Member already exist in this dao"));
        }
        Ok(())
    })?;

    let principal_id = api::caller();
    let dao_id = ic_cdk::api::id();

    let proposal = ProposalInput {
        proposal_description: String::from(crate::utils::REQUEST_JOIN_DAO),
        group_to_join: None,
        proposal_title: String::from(crate::utils::TITLE_ADD_MEMBER),
        proposal_type: crate::ProposalType::AddMemberToDaoProposal,
        principal_of_action: Some(api::caller()),
        new_dao_name: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to : None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period : None,
        new_dao_type : None,
        group_to_remove : None,
    };

    let response: CallResult<(Result<(), String>,)> = ic_cdk::call(
        daohouse_backend_id,
        "store_join_dao",
        (dao_id, principal_id),
    )
    .await;

    match response {
        Ok((Ok(()),)) => (),
        Ok((Err(err),)) => return Err(err),
        Err((code, message)) => {
            let err_msg = match code {
                RejectionCode::NoError => "NoError".to_string(),
                RejectionCode::SysFatal => "SysFatal".to_string(),
                RejectionCode::SysTransient => "SysTransient".to_string(),
                RejectionCode::DestinationInvalid => "DestinationInvalid".to_string(),
                RejectionCode::CanisterReject => "CanisterReject".to_string(),
                _ => format!("Unknown rejection code: {:?}: {}", code, message),
            };
            return Err(err_msg);
        }
    };

    Ok(crate::proposal_route::create_proposal_controller(daohouse_backend_id, proposal).await)
}

#[query]
fn get_dao_members() -> Vec<Principal> {
    with_state(|state| state.dao.members.clone())
}

#[query]
fn get_dao_followers() -> Vec<Principal> {
    with_state(|state| state.dao.followers.clone())
}

#[update(guard=prevent_anonymous)]
pub async fn follow_dao(daohouse_backend_id: Principal) -> Result<String, String> {
    let principal_id = api::caller();
    let dao_id = ic_cdk::api::id();

    let already_following = with_state(|state| {
        let dao = &state.dao;
        dao.followers.contains(&principal_id)
    });

    if already_following {
        return Err(String::from(crate::utils::WARNING_ALREADY_FOLLOW_DAO));
    }
    let response: CallResult<(Result<(), String>,)> = ic_cdk::call(
        daohouse_backend_id,
        "store_follow_dao",
        (dao_id, principal_id),
    )
    .await;

    match response {
        Ok((Ok(()),)) => (),
        Ok((Err(err),)) => return Err(err),
        Err((code, message)) => {
            let err_msg = match code {
                RejectionCode::NoError => "NoError".to_string(),
                RejectionCode::SysFatal => "SysFatal".to_string(),
                RejectionCode::SysTransient => "SysTransient".to_string(),
                RejectionCode::DestinationInvalid => "DestinationInvalid".to_string(),
                RejectionCode::CanisterReject => "CanisterReject".to_string(),
                _ => format!("Unknown rejection code: {:?}: {}", code, message),
            };
            return Err(err_msg);
        }
    };

    with_state(|state| {
        let dao = &mut state.dao;
        dao.followers.push(principal_id);
        dao.followers_count += 1;
    });

    Ok(String::from(crate::utils::SUCCESS_FOLLOW_DAO))
}

#[update(guard=guard_check_members)]
fn update_dao_settings(update_dao_details: UpdateDaoSettings) -> Result<String, String> {
    // member_permission(String::from("ChangeDAOConfig"))?;
    member_permission(String::from(crate::utils::PERMISSION_CHANGE_DAO_CONFIG))?;

    with_state(|state| {
        let mut original_dao = state.dao.clone();
        original_dao.dao_name = update_dao_details.dao_name;
        original_dao.purpose = update_dao_details.purpose;
        original_dao.link_of_document = update_dao_details.link_of_document;
        original_dao.members = update_dao_details.members;
        original_dao.followers = update_dao_details.followers;

        state.dao = original_dao;

        Ok(String::from(crate::utils::SUCCESS_DAO_UPDATED))
    })
}

// // #[update(guard=)]
// #[update(guard = prevent_anonymous)]
// pub async fn unfollow_dao(daohouse_backend_id: Principal) -> Result<String, String> {

//     let principal_id = api::caller();
//     let dao_id = ic_cdk::api::id();

//     with_state(|state| {
//         let dao = &mut state.dao;
//         if dao.followers.contains(&api::caller()) {
//             dao.followers.retain(|s| s != &api::caller());
//             state.dao.followers_count -= 1;

//             let response: CallResult<(Result<(), String>,)> = ic_cdk::call(
//                 daohouse_backend_id,
//                 "remove_follow_dao",
//                 (dao_id, principal_id),
//             ).await;

//             match response {
//                 Ok((Ok(()),)) => (),
//                 Ok((Err(err),)) => return Err(err),
//                 Err((code, message)) => {
//                     let err_msg = match code {
//                         RejectionCode::NoError => "NoError".to_string(),
//                         RejectionCode::SysFatal => "SysFatal".to_string(),
//                         RejectionCode::SysTransient => "SysTransient".to_string(),
//                         RejectionCode::DestinationInvalid => "DestinationInvalid".to_string(),
//                         RejectionCode::CanisterReject => "CanisterReject".to_string(),
//                         _ => format!("Unknown rejection code: {:?}: {}", code, message),
//                     };
//                     return Err(err_msg);
//                 }
//             };

//             Ok(String::from(crate::utils::SUCCESS_FOLLOW_DAO))
//         } else {
//             Err(String::from(crate::utils::WARNING_DONT_FOLLOW))
//         }
//     })
// }

#[update(guard=prevent_anonymous)]
pub async fn unfollow_dao(daohouse_backend_id: Principal) -> Result<String, String> {
    let principal_id = api::caller();
    let dao_id = ic_cdk::api::id();

    let is_follow = with_state(|state| {
        let dao = &mut state.dao;
        if dao.followers.contains(&principal_id) {
            dao.followers.retain(|s| s != &principal_id);
            state.dao.followers_count -= 1;
            true
        } else {
            false
        }
    });

    if is_follow {
        let response: CallResult<(Result<(), String>,)> = ic_cdk::call(
            daohouse_backend_id,
            "remove_follow_dao",
            (dao_id, principal_id),
        )
        .await;

        match response {
            Ok((Ok(()),)) => Ok(crate::utils::SUCCESS_UNFOLLOW_DAO.to_string()),
            Ok((Err(err),)) => Err(err),
            Err((code, message)) => {
                let err_msg = match code {
                    RejectionCode::NoError => "NoError".to_string(),
                    RejectionCode::SysFatal => "SysFatal".to_string(),
                    RejectionCode::SysTransient => "SysTransient".to_string(),
                    RejectionCode::DestinationInvalid => "DestinationInvalid".to_string(),
                    RejectionCode::CanisterReject => "CanisterReject".to_string(),
                    _ => format!("Unknown rejection code: {:?}: {}", code, message),
                };
                Err(err_msg)
            }
        }
    } else {
        Err(crate::utils::WARNING_DONT_FOLLOW.to_string())
    }
}

// add members guard
#[update(guard=guard_daohouse_exclusive_method)]
fn add_ledger_canister_id(id: LedgerCanisterId) -> Result<(), String> {
    with_state(|state| state.dao.token_ledger_id = id);

    Ok(())
}

// get dao groups
#[query]
fn get_dao_groups() -> Vec<DaoGroup> {
    let mut groups: Vec<DaoGroup> = Vec::new();

    with_state(|state| {
        for x in state.dao_groups.iter() {
            groups.push(x.1)
        }
    });

    groups
}
