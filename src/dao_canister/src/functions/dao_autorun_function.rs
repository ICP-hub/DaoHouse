use super::{icrc_get_balance, icrc_transfer};
use crate::{with_state, TokenTransferArgs};
use candid::Principal;
use ic_cdk::api;
use ic_cdk::update;

#[update]
async fn run_add_member_to_group(
    principal_id: Principal,
    group_name: String,
) -> Result<String, String> {
    let mut group_exists = false;
    let is_already_member = with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&group_name) {
            group_exists = true;
            if dao_group.group_members.contains(&principal_id) {
                return true;
            }
        }
        false
    });

    if is_already_member {
        return Err(String::from(crate::utils::WARNING_ALREADY_DAO_MEMBER));
    }

    if !group_exists {
        return Err(String::from(crate::utils::NOTFOUND_GROUP));
    }

    with_state(|state| {
        if let Some(dao_group) = &mut state.dao_groups.get(&group_name) {
            dao_group.group_members.push(principal_id);
            Ok(String::from(
                crate::utils::MESSAGE_MEMBER_ADDED_SUCCESSFULLY,
            ))
        } else {
            Err(String::from(crate::utils::NOTFOUND_GROUP))
        }
    })
}

#[update]
async fn run_remove_member_to_group(
    principal_id: Principal,
    group_name: String,
) -> Result<String, String> {
    let mut group_exists = false;
    let is_already_member = with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&group_name) {
            group_exists = true;
            if dao_group.group_members.contains(&principal_id) {
                return true;
            }
        }
        false
    });

    if !is_already_member {
        return Err(String::from(crate::utils::WARNING_NO_DAO_GROUP_MEMBER));
    }

    if !group_exists {
        return Err(String::from(crate::utils::NOTFOUND_GROUP));
    }

    with_state(|state| {
        if let Some(dao_group) = &mut state.dao_groups.get(&group_name) {
            dao_group.group_members.retain(|s| s != &principal_id);
            Ok(String::from(
                crate::utils::MESSAGE_MEMBER_REMOVE_SUCCESSFULLY,
            ))
        } else {
            Err(String::from(crate::utils::NOTFOUND_GROUP))
        }
    })
}

#[update]
async fn run_add_member_to_dao(principal_id: Principal) -> Result<String, String> {
    with_state(|state| {
        let dao = &mut state.dao;

        if dao.members.contains(&principal_id) {
            Err(String::from(crate::utils::MESSAGE_ALREADY_DAO_MEMBER))
        } else {
            dao.members.push(principal_id);
            state.dao.members_count += 1;
            Ok(String::from(
                crate::utils::MESSAGE_DAO_MEMBER_ADDED_SUCCESSFULLY,
            ))
        }
    })
}

#[update]
async fn run_remove_member_from_dao(principal_id: Principal) -> Result<String, String> {
    let is_member = with_state(|state| state.dao.members.contains(&principal_id));

    if !is_member {
        return Err(String::from(crate::utils::WARNING_NO_DAO_MEMBER));
    }

    with_state(|state| {
        state.dao.members.retain(|s| s != &principal_id);
        Ok(String::from(
            crate::utils::MESSAGE_DAO_MEMBER_REMOVE_SUCCESSFULLY,
        ))
    })
}

#[update]
async fn run_chnage_dao_config(args: crate::types::ChangeDaoConfigArg) -> Result<String, String> {
    with_state(|state| {
        state.dao.dao_name = args.dao_name;
        state.dao.purpose = args.purpose;
        state.dao.daotype = args.daotype;
        Ok(String::from(
            crate::utils::MESSAGE_CHANGE_DAO_CONFIG_SUCCESSFULLY,
        ))
    })
}

#[update]
async fn run_chnage_dao_policy(args: crate::types::ChangeDaoPolicyArg) -> Result<String, String> {
    with_state(|state| {
        state.dao.cool_down_period = args.cool_down_period;
        state.dao.required_votes = args.required_votes;
        Ok(String::from(
            crate::utils::MESSAGE_CHANGE_DAO_POLICY_SUCCESSFULLY,
        ))
    })
}

#[update]
async fn run_transfer_token(args: TokenTransferArgs) -> Result<String, String> {
    let principal_id = api::caller();
    let balance = icrc_get_balance(principal_id)
        .await
        .map_err(|err| format!("Error while fetching user balance {}", err))?;
    if balance >= 0 as u8 {
        return Err(String::from(
            "User token balance is less then the required transfer tokens",
        ));
    } else {
        let token_transfer_args = TokenTransferArgs {
            from: args.from,
            to: args.to,
            tokens: args.tokens as u64,
        };
        icrc_transfer(token_transfer_args)
            .await
            .map_err(|err| format!("Error in transfer of tokens: {}", String::from(err)))?;
        Ok("()".to_string())
    }
}
