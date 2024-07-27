use crate::{guards::*, UpdateDaoSettings};
use crate::{proposal_route, with_state, GroupList};
use candid::Principal;
use ic_cdk::api;
use ic_cdk::{query, update};

#[query]
async fn get_members_of_group(group: String) -> Result<GroupList, String> {
    with_state(|state| match state.groups.get(&group) {
        Some(group_list) => Ok(group_list.clone()),
        None => Err(format!("Group {} not found", group)),
    })
}

#[update]
async fn add_member_to_group(group: String, principal: Principal) -> String {
    let principal_id = api::caller();
    if principal_id == Principal::anonymous() {
        return "Anonymous principal not allowed to make calls.".to_string();
    }

    let council_group = "council".to_string();

    let is_allowed = with_state(|state| {
        state
            .groups
            .get(&council_group)
            .map_or(false, |group_list| group_list.users.contains(&principal_id))
    });

    if !is_allowed {
        return format!(
            "Caller with principal {:?} is not allowed to add members to group {}",
            principal_id, group
        );
    }

    let result =
        with_state(|state| proposal_route::add_member_to_group(state, group.clone(), principal));
    result
}

//
#[update]
async fn remove_member_from_group(group: String, principal: Principal) -> String {
    let principal_id = api::caller();
    if principal_id == Principal::anonymous() {
        return "Anonymous principal not allowed to make calls.".to_string();
    }

    let council_group = "council".to_string();

    let is_allowed = with_state(|state| {
        state
            .groups
            .get(&council_group)
            .map_or(false, |group_list| group_list.users.contains(&principal_id))
    });

    if !is_allowed {
        return format!(
            "Caller with principal {:?} is not allowed to remove members from group {}",
            principal_id, group
        );
    }

    let result = with_state(|state| {
        proposal_route::remove_member_from_group(state, group.clone(), principal)
    });
    result
}

#[update]
fn join_dao() -> Result<String, String> {
    let principal_id = api::caller();

    if principal_id == Principal::anonymous() {
        return Err("Anonymous principal not allowed, try logging in".to_string());
    }

    with_state(|state| -> Result<String, String> {
        if state.dao.members.contains(&principal_id) {
            return Err("You are already member of this Dao".to_string());
        }

        let mut members = state.dao.members.clone();

        members.push(principal_id.clone());

        state.dao.members = members;
        Ok("Successfully joined DAO".to_string())
    })
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
fn follow_dao() -> Result<String, String> {
    let principal_id = api::caller();

    with_state(|state| {
        let followers = &mut state.dao.followers;
        if followers.contains(&principal_id) {
            return Err(String::from("You are already following the user"));
        }
        followers.push(principal_id);
        return Ok(String::from("Successfully followed !"));
    })
}

#[update(guard=check_members)]
fn update_dao_settings(update_dao_details: UpdateDaoSettings) -> Result<String, String> {
    member_permission(String::from("ChangeDAOConfig"))?;
    with_state(|state| {
        let mut original_dao = state.dao.clone();
        original_dao.dao_name = update_dao_details.dao_name;
        original_dao.purpose = update_dao_details.purpose;
        original_dao.link_of_document = update_dao_details.link_of_document;
        original_dao.members = update_dao_details.members;
        original_dao.followers = update_dao_details.followers;

        state.dao = original_dao;

        Ok(String::from("DAO settings updated. "))
    })
}

// #[update(guard=)]
