use crate::proposal_route::create_proposal_controller;
use crate::{
    guards::*, AddMemberArgs, BountyDone, BountyRaised, ChangeDaoConfigArg, ChangeDaoPolicy,
    CreateGeneralPurpose, CreatePoll, DaoGroup, JoinDao, LedgerCanisterId, ProposalCreation,
    ProposalInput, ProposalState, RemoveDaoMemberArgs, RemoveMemberArgs, TokenTransferPolicy,
};
use crate::icrc_get_balance;
use crate::{with_state, ProposalType};
use candid::{Nat, Principal};
use ic_cdk::api;
use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk::{query, update};
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};

#[query(guard = prevent_anonymous)]
async fn get_members_of_group(group: String) -> Result<Vec<Principal>, String> {
    with_state(|state| match state.dao_groups.get(&group) {
        Some(val) => Ok(val.group_members),
        None => Err(String::from(crate::utils::NOTFOUND_GROUP)),
    })
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_add_member_to_group(args: AddMemberArgs) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::AddMemberToGroupProposal,
    };
    guard_check_proposal_creation(proposal_data)?;

    let result = with_state(|state| {
        match state
            .dao_groups
            .iter()
            .find(|(_, group)| group.group_name == args.group_name)
        {
            Some(_) => Ok(()),
            None => Err(format!("No Group Name found with '{}'", args.group_name)),
        }
    });

    if result.is_err() {
        return Err(format!("No Group Name found with '{}' ", args.group_name));
    }

    //create condition for check if group is exit or not for adding member , removing members

    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

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
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        new_dao_type: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };

    with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&args.group_name) {
            if dao_group.group_members.contains(&args.new_member) {
                return Err(format!("Member already exist in this group"));
            }
        }
        Ok(())
    })?;

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;

    Ok(String::from(crate::utils::REQUEST_ADD_MEMBER))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_remove_member_to_group(args: RemoveMemberArgs) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::RemoveMemberToGroupProposal,
    };
    guard_check_proposal_creation(proposal_data)?;
    let result = with_state(|state| {
        match state
            .dao_groups
            .iter()
            .find(|(_, group)| group.group_name == args.group_name)
        {
            Some(_) => Ok(()),
            None => Err(format!("No Group Name found with '{}'", args.group_name)),
        }
    });
    if result.is_err() {
        return Err(format!("No Group Name found with '{}' ", args.group_name));
    }
    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(args.action_member),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_REMOVE_MEMBER),
        proposal_type: ProposalType::RemoveMemberToGroupProposal,
        group_to_remove: Some(args.group_name.clone()),
        new_dao_name: None,
        dao_purpose: None,
        group_to_join: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        new_dao_type: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };

    with_state(|state| {
        if let Some(dao_group) = state.dao_groups.get(&args.group_name) {
            if !dao_group.group_members.contains(&args.action_member) {
                return Err(format!("Member does not exist in this group"));
            }
        }
        Ok(())
    })?;

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::TITLE_DELETE_MEMBER))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_remove_member_to_dao(args: RemoveDaoMemberArgs) -> Result<String, String> {
    let mut required_thredshold = 0;
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::RemoveMemberToDaoProposal,
    };
    guard_check_proposal_creation(proposal_data)?;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

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
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        new_dao_type: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };

    with_state(|state| {
        if !state.dao.members.contains(&args.action_member) {
            return Err(format!("Member does not exist in this dao"));
        }
        Ok(())
    })?;

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::TITLE_DELETE_MEMBER))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_change_dao_config(args: ChangeDaoConfigArg) -> Result<String, String> {
    let mut required_thredshold = 0;
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::ChangeDaoConfig,
    };
    guard_check_proposal_creation(proposal_data)?;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CHANGE_DAO_CONFIG),
        proposal_type: ProposalType::ChangeDaoConfig,
        new_dao_name: Some(args.new_dao_name),
        new_dao_type: Some(args.daotype),
        group_to_join: None,
        dao_purpose: Some(args.purpose),
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_CHANGE_DAO_CONFIG))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_change_dao_policy(args: ChangeDaoPolicy) -> Result<String, String> {
    let mut required_thredshold = 0;
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::ChangeDaoPolicy,
    };
    guard_check_proposal_creation(proposal_data)?;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CHANGE_DAO_POLICY),
        proposal_type: ProposalType::ChangeDaoPolicy,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        new_dao_type: None,
        group_to_remove: None,
        required_votes: None,
        cool_down_period: Some(args.cool_down_period),
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: Some(args.required_votes),
        task_completion_day: None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_CHANGE_DAO_POLICY))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_transfer_token(args: TokenTransferPolicy) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::TokenTransfer,
    };
    guard_check_proposal_creation(proposal_data)?;
    let principal_id: Principal = api::caller();

    if principal_id == args.to {
        return Err(String::from("transfer token with self not possible"));
    };
    let token_ledger_id = with_state(|state| state.dao.token_ledger_id.id);
    let balance = icrc_get_balance(token_ledger_id, principal_id)
        .await
        .map_err(|err| format!("Error while fetching user balance: {}", err))?;

    if balance <= args.tokens as u8 {
        return Err(String::from(
            "User token balance is less than the required transfer tokens",
        ));
    }
    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(principal_id),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_TOKEN_TRANSFER_POLICY),
        proposal_type: ProposalType::TokenTransfer,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from: Some(principal_id),
        token_to: Some(args.to),
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        new_dao_type: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_TOKEN_TRANSFER_POLICY))
}

async fn transfer(tokens: u64, user_principal: Principal) -> Result<BlockIndex, String> {
    let canister_id: Principal = ic_cdk::api::id();
    let ledger_canister_id = with_state(|state| state.dao.token_ledger_id.id);

    let transfer_args = TransferFromArgs {
        amount: tokens.into(),
        to: Account {
            owner: canister_id,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: user_principal,
            subaccount: None,
        },
    };

    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        ledger_canister_id,
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    .0
    .map_err(|e| format!("ledger transfer error {:?}", e))
}

#[update(guard = prevent_anonymous)]
async fn make_payment(tokens: u64, user: Principal) -> Result<Nat, String> {
    transfer(tokens, user).await
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_bounty_raised(args: BountyRaised) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::BountyRaised,
    };
    guard_check_proposal_creation(proposal_data)?;
    let mut required_thredshold = 0;
    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal_expire_time =
        ic_cdk::api::time() + (args.task_completion_day * 86_400 * 1_000_000_000);

    let test_expire_time = 3 * 60 * 1_000_000_000;


    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_BOUNTY_RAISED),
        proposal_type: ProposalType::BountyRaised,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from: Some(ic_cdk::api::id()),
        token_to: Some(api::caller()),
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: Some(args.bounty_task),
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        new_dao_type: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: Some(test_expire_time),
    };

    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;

    Ok(String::from(crate::utils::MESSAGE_BOUNTY_RAISED))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_bounty_done(args: BountyDone) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::BountyRaised,
    };
    guard_check_proposal_creation(proposal_data)?;
    let proposals_data = with_state(|state| state.proposals.get(&args.associated_proposal_id));

    let mut bounty_task = None;
    let mut token_to : Option<Principal> = None;

    if let Some(proposal) = proposals_data {
        let proposal_type = proposal.proposal_type;
        let proposal_status = proposal.proposal_status;
        let proposal_owner = proposal.created_by;

        if proposal_type != ProposalType::BountyRaised {
            return Err(String::from(
                "The Proposal you wish to done is not related to the bounty raised",
            ));
        };
        if proposal_status != ProposalState::Accepted {
            return Err(String::from(
                "The Proposal you wish to done is not under the Accepted status",
            ));
        }
        if proposal_owner != api::caller() {
            return Err(String::from("bounty is not raised by you with this proposal ID"));
        }

        let current_time = ic_cdk::api::time();
        let proposal_submitted_at = proposal.proposal_submitted_at;
        let proposal_expiry_time = proposal.task_completion_day;

        if let Some(expiry_time) = proposal_expiry_time {
            if current_time > proposal_submitted_at + expiry_time {
                return Err(String::from(
                    "The proposal has expired and can't longer be completed.",
                ));
            }
        }
        token_to = proposal.token_to;
        bounty_task = proposal.bounty_task;
    }

    let mut required_thredshold = 0;
    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal_input = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_BOUNTY_DONE),
        proposal_type: ProposalType::BountyDone,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: Some(args.tokens),
        token_from: Some(api::id()),
        token_to: token_to,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: bounty_task,
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        group_to_remove: None,
        new_dao_type: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: Some(args.associated_proposal_id.clone()),
        new_required_votes: None,
        task_completion_day: None,
    };
    create_proposal_controller(args.daohouse_canister_id.clone(), proposal_input.clone()).await;
    Ok(String::from(crate::utils::MESSAGE_BOUNTY_DONE))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_create_poll(args: CreatePoll) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::Polls,
    };
    guard_check_proposal_creation(proposal_data)?;

    let mut required_thredshold = 0;
    let proposal_expire_time =
        ic_cdk::api::time() + (args.proposal_expired_at as u64 * 86_400 * 1_000_000_000);

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CREATE_POLL),
        proposal_type: ProposalType::Polls,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: Some(proposal_expire_time),
        bounty_task: None,
        poll_title: Some(args.poll_title),
        required_votes: None,
        cool_down_period: None,
        new_dao_type: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_POLL_CREATE_DONE))
}

#[update(guard = prevent_anonymous)]
async fn proposal_to_create_general_purpose(args: CreateGeneralPurpose) -> Result<String, String> {
    let proposal_data = ProposalCreation {
        entry: args.proposal_entry.clone(),
        proposal_type: ProposalType::GeneralPurpose,
    };

    guard_check_proposal_creation(proposal_data)?;

    let mut required_thredshold = 0;

    let _ = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.proposal_entry)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!(
                    "No place Found with the name of {:?}",
                    args.proposal_entry
                ));
            }
        }
    });

    let proposal = ProposalInput {
        principal_of_action: Some(api::caller()),
        proposal_description: args.description,
        proposal_title: String::from(crate::utils::TITLE_CREATE_GENERAL_PURPOSE),
        proposal_type: ProposalType::GeneralPurpose,
        new_dao_name: None,
        group_to_join: None,
        dao_purpose: None,
        tokens: None,
        token_from: None,
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: Some(args.proposal_title),
        required_votes: None,
        cool_down_period: None,
        new_dao_type: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };
    create_proposal_controller(with_state(|state| state.dao.daohouse_canister_id), proposal).await;
    Ok(String::from(crate::utils::MESSAGE_GENERAL_PURPOSE_CREATED))
}

#[update(guard = prevent_anonymous)]
async fn ask_to_join_dao(args: JoinDao) -> Result<String, String> {
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

    let should_ask = with_state(|state| state.dao.ask_to_join_dao);
    if !should_ask {
        with_state(|state| {
            state.dao.members.push(api::caller());
            state.dao.members_count += 1;
        });
        return Ok(String::from("Dao Joined successfully"));
    };
    let principal_id = api::caller();
    let dao_id = ic_cdk::api::id();
    let mut required_thredshold = 0;

    let result = with_state(|state| {
        match state
            .dao
            .proposal_entry
            .iter()
            .find(|place| place.place_name == args.place_to_join)
        {
            Some(val) => {
                required_thredshold = val.min_required_thredshold;
                Ok(())
            }
            None => {
                return Err(format!("No place Found for join this dao"));
            }
        }
    });

    if result.is_err() {
        return Err(format!("No place Found for join this dao"));
    }

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
        token_to: None,
        proposal_created_at: None,
        proposal_expired_at: None,
        bounty_task: None,
        poll_title: None,
        required_votes: None,
        cool_down_period: None,
        new_dao_type: None,
        group_to_remove: None,
        minimum_threadsold: required_thredshold,
        link_of_task: None,
        associated_proposal_id: None,
        new_required_votes: None,
        task_completion_day: None,
    };

    let response: CallResult<(Result<(), String>,)> = ic_cdk::call(
        args.daohouse_backend_id,
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

    Ok(create_proposal_controller(args.daohouse_backend_id, proposal).await)
}

#[query(guard = prevent_anonymous)]
fn get_dao_members() -> Vec<Principal> {
    with_state(|state| state.dao.members.clone())
}

#[query(guard = prevent_anonymous)]
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

#[update(guard=guard_daohouse_exclusive_method)]
fn add_ledger_canister_id(id: LedgerCanisterId) -> Result<(), String> {
    with_state(|state| state.dao.token_ledger_id = id);

    Ok(())
}

#[query(guard = prevent_anonymous)]
fn get_dao_groups() -> Vec<DaoGroup> {
    let mut groups: Vec<DaoGroup> = Vec::new();

    with_state(|state| {
        for x in state.dao_groups.iter() {
            groups.push(x.1)
        }
    });

    groups
}