use candid::Principal;
use ic_cdk::api;

use crate::{with_state, ProposalType};

//  prevent anonymous user
pub fn prevent_anonymous() -> Result<(), String> {
    if api::caller() == Principal::anonymous() {
        return Err(String::from(crate::utils::WARNING_ANONYMOUS_CALL));
    }
    Ok(())
}

// to check for dao owner / members
pub fn guard_check_members() -> Result<(), String> {
    prevent_anonymous()?;
    with_state(|state| {
        if state.dao.members.contains(&api::caller()) {
            return Ok(());
        } else {
            return Err(String::from(crate::utils::WARNING_DAO_MEMBER_ONLY));
        }
    })
}

// to check members permissions
pub fn member_permission(permission: String) -> Result<(), String> {
    prevent_anonymous()?;
    guard_check_members()?;

    with_state(|state| {
        if state.dao.members_permissions.contains(&permission) {
            return Ok(());
        } else {
            return Err(String::from(crate::utils::WARNING_NOT_ALLOWED));
        }
    })
}

// check for user who has already voted
pub fn check_voting_right(proposal_id: &String) -> Result<(), String> {
    guard_check_members()?;
    // prevent_anonymous()?;
    let principal_id = api::caller();

    with_state(|state| match state.proposals.get(&proposal_id) {
        Some(pro) => {
            if !pro.approved_votes_list.contains(&principal_id)
                && !pro.rejected_votes_list.contains(&principal_id)
            {
                Ok(())
            } else {
                Err(String::from(crate::utils::WARNING_ALREADY_VOTED))
            }
        }
        None => Err(String::from(crate::utils::WARNING_NO_PROPOSAL)),
    })
}

// check group member permission
pub fn check_group_member_permission(
    group_name: &String,
    permission: String,
) -> Result<(), String> {
    prevent_anonymous()?;
    with_state(|state| match state.dao_groups.get(&group_name) {
        Some(val) => {
            if val.group_permissions.contains(&permission) {
                Ok(())
            } else {
                Err(String::from(crate::utils::WARNING_NOT_ALLOWED))
            }
        }
        None => Err(format!("{} {}", crate::utils::NOTFOUND_GROUP, group_name)),
    })
}

// check user in a group
pub fn check_user_in_group(group_name: &String) -> Result<(), String> {
    prevent_anonymous()?;
    with_state(|state| match state.dao_groups.get(&group_name) {
        Some(val) => {
            if val.group_members.contains(&api::caller()) {
                Ok(())
            } else {
                Err(format!(
                    "{} {}",
                    crate::utils::WARNING_NOT_IN_GROUP,
                    group_name
                ))
            }
        }
        None => Err(format!("{} {}", crate::utils::NOTFOUND_GROUP, group_name)),
    })
}

// check if proposal exists
pub fn guard_check_if_proposal_exists(
    action_principal: Principal,
    proposal_type: ProposalType,
) -> Result<(), String> {
    prevent_anonymous()?;
    with_state(|state| {
        for (_key, val) in state.proposals.iter() {
            if val.proposal_type == proposal_type && val.principal_of_action == action_principal {
                return Err(String::from(crate::utils::WARNING_PROPOSAL_EXISTS));
            }
        }
        Ok(())
    })
}

// guard to allow only daohouse backend to call
pub fn guard_daohouse_exclusive_method() -> Result<(), String> {
    if api::caller() == with_state(|state| state.dao.daohouse_canister_id) {
        return Ok(());
    } else {
        return Err(String::from(crate::utils::WARNING_NOT_ALLOWED));
    }
}

// check council member
pub fn guard_council_members_only() -> Result<(), String> {
    prevent_anonymous()?;

    with_state(|state| {
        match state
            .dao_groups
            .get(&String::from(crate::utils::COUNCIL_GROUP_NAME))
        {
            Some(_val) => Ok(()),
            None => return Err(String::from(crate::utils::NOTFOUND_GROUP)),
        }
    })
}

// // get group permissions
// pub fn guard_check_group_permission(group_name: &String, permission: &String) -> Result<(), String> {
//     with_state(|state|)
// }
