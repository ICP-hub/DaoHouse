use crate::State;

use candid::Principal;



pub fn add_member_to_group(state: &mut State, group: String, principal_id: Principal) -> String {
    
    match state.groups.get_mut(&group) {
        Some(group_list) => {
            if !group_list.users.contains(&principal_id) {
                group_list.users.push(principal_id);
                "Member added successfully".to_string()
            } else {
                "Member already exists".to_string()
            }
        }
        None => "Group not found".to_string(),
    }
}



pub fn remove_member_from_group(state: &mut State, group: String, principal_id: Principal) -> String {
    match state.groups.get_mut(&group) {
        Some(group_list) => {
            if group_list.users.contains(&principal_id) {
                group_list.users.retain(|user| user != &principal_id);
                "Member removed successfully".to_string()
            } else {
                "Member not found in the group".to_string()
            }
        }
        None => "Group not found".to_string(),
    }
}

