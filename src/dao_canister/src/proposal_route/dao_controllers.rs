use crate::{with_state, State};

use candid::Principal;

pub fn proposal_to_add_member_to_group(
    group_name: &String,
    new_member: Principal,
) -> Result<(), String> {
    with_state(|state| match &mut state.dao_groups.get(&group_name) {
        Some(val) => {
            val.group_members.push(new_member);
            Ok(())
        }
        None => Err(format!("No group exists with the name {}", group_name)),
    })
}

// pub fn add_member_to_group(state: &mut State, group: String, principal_id: Principal) -> String {

//     if let Some(mut group_list) = state.groups.remove(&group) {
//         if !group_list.users.contains(&principal_id) {
//             group_list.users.push(principal_id);
//             state.groups.insert(group, group_list);
//             "Member added successfully".to_string()
//         } else {
//             state.groups.insert(group, group_list);
//             "Member already exists".to_string()
//         }
//     } else {
//         "Group not found".to_string()
//     }
// }

// pub fn remove_member_from_group(state: &mut State, group: String, principal_id: Principal) -> String {
//     if let Some(mut group_list) = state.groups.remove(&group) {
//         if group_list.users.contains(&principal_id) {
//             group_list.users.retain(|user| user != &principal_id);
//             state.groups.insert(group, group_list);
//             "Member removed successfully".to_string()
//         } else {
//             state.groups.insert(group, group_list);
//             "Member not found in the group".to_string()
//         }
//     } else {
//         "Group not found".to_string()
//     }
// }
