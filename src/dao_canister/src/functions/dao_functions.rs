use crate::{proposal_route, with_state, GroupList};
use candid::types::principal;
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


// #[update]
// async fn add_member_to_group(group: String, principal: Principal) -> String {
//     let principal_id = api::caller();
//     if principal_id == Principal::anonymous() {
//         return "Anonymous principal not allowed to make calls.".to_string();
//     }

//     let council_group = "council".to_string();

//     let is_allowed = with_state(|state| {
//         state.groups.get(&council_group).map_or(false, |group_list| {
//             group_list.users.contains(&principal_id)
//         })
//     });

//     if !is_allowed {
//         return format!("Caller with principal {:?} is not allowed to add members to group {}", principal_id, group);
//     }

//     let result = with_state(|state| proposal_route::add_member_to_group(state, group.clone(), principal));
//     result
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
//         state.groups.get(&council_group).map_or(false, |group_list| {
//             group_list.users.contains(&principal_id)
//         })
//     });

//     if !is_allowed {
//         return format!("Caller with principal {:?} is not allowed to remove members from group {}", principal_id, group);
//     }

//     let result = with_state(|state| proposal_route::remove_member_from_group(state, group.clone(), principal));
//     result
// }

#[query]
async fn join_dao() -> Result<String, String> {

    let principal_id = api::caller();

    if principal_id == Principal::anonymous() {
        return Err("Anonymous principal not allowed, try logging in".to_string());
    }

    with_state(|state| -> Result<String, String> {
        if state.dao.members.contains(&principal_id.to_string()) {
            return Err("You are already member of this Dao".to_string());
        }

        let mut members = state.dao.members.clone();

        members.push(principal_id.to_string().clone());

        state.dao.members = members;

        // if let Some(mut members) = state.dao.members

        

        // state.dao.members.push(principal_id.clone());
        // let members: &mut Vec<Principal> = state.dao.members.as_mut();
        Ok("Successfully joined DAO".to_string())

    })

}



