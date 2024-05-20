use crate::{proposal_route, with_state, GroupList};
use candid:: Principal;
use ic_cdk::{query, update};
use ic_cdk::api;



#[query]
async fn get_members_of_group(group: String) -> Result<GroupList, String> {
    with_state(|state| {
        match state.groups.get(&group) {
            Some(group_list) => Ok(group_list.clone()),
            None => Err(format!("Group {} not found", group)),
        }
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
        state.groups.get(&council_group).map_or(false, |group_list| {
            group_list.users.contains(&principal_id)
        })
    });

    if !is_allowed {
        return format!("Caller with principal {:?} is not allowed to add members to group {}", principal_id, group);
    }

    let result = with_state(|state| proposal_route::add_member_to_group(state, group.clone(), principal));
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
        state.groups.get(&council_group).map_or(false, |group_list| {
            group_list.users.contains(&principal_id)
        })
    });

    if !is_allowed {
        return format!("Caller with principal {:?} is not allowed to remove members from group {}", principal_id, group);
    }

    let result = with_state(|state| proposal_route::remove_member_from_group(state, group.clone(), principal));
    result
}



