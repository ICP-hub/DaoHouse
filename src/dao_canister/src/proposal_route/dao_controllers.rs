use crate::State;

use candid::Principal;



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


