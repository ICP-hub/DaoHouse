mod types;
use functions::{icrc_get_balance, icrc_transfer};
use ic_cdk::{api, export_candid, init};
use std::cell::RefCell;
pub mod proposal_route;
mod state_handler;
use state_handler::State;
mod memory;
use memory::Memory;
mod functions;
mod guards;
// #[macro_use]
extern crate ic_cdk_macros;
use candid::Principal;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use types::*;
mod utils;
use ic_cdk::api::time;
use ic_cdk_timers::set_timer_interval;
use std::time::Duration;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

const EXPIRATION_TIME: u64 = 2 * 60 * 1_000_000_000;

fn start_proposal_checker() {
    set_timer_interval(Duration::from_secs(60), || {
        check_proposals();
    });
}

fn check_proposals() {
    with_state(|state: &mut State| {
        let timestamp = time();
        let mut proposals_to_update: Vec<Proposals> = Vec::new();

        for (_, proposal) in state.proposals.iter() {
            let time_diff = timestamp.saturating_sub(proposal.proposal_submitted_at);
            let proposal_approved_votes = proposal.proposal_approved_votes as f64;
            let proposal_rejected_votes = proposal.proposal_rejected_votes as f64;
            let total_votes = proposal_approved_votes + proposal_rejected_votes;
            let total_percentage = (proposal_approved_votes / total_votes) * 100.0;

            let mut proposal = proposal.clone();
            if time_diff >= EXPIRATION_TIME && !proposal.has_been_processed {
                proposal.has_been_processed = true;
                if total_percentage >= 51.0 {
                    proposal.proposal_status = ProposalState::Accepted;
                    proposals_to_update.push(proposal.clone());
                } else if total_percentage > 0.0 {
                    proposal.proposal_status = ProposalState::Rejected;
                } else {
                    proposal.proposal_status = ProposalState::Expired;
                }
            } else {
                proposal.proposal_status = ProposalState::Open;
            }
            proposals_to_update.push(proposal);
        }

        for mut proposal in proposals_to_update {
            proposal.has_been_processed = false;
            if proposal.proposal_status == ProposalState::Accepted
            && !proposal.has_been_processed_secound {
                proposal.has_been_processed_secound = true;
                if let ProposalType::AddMemberToDaoProposal = proposal.proposal_type {
                    add_member_to_dao(state, &proposal);
                } else if let ProposalType::AddMemberToGroupProposal = proposal.proposal_type {
                    add_member_to_group(state, &proposal);
                } else if let ProposalType::RemoveMemberToDaoProposal = proposal.proposal_type {
                    remove_member_from_dao(state, &proposal);
                } else if let ProposalType::RemoveMemberToGroupProposal = proposal.proposal_type {
                    remove_member_to_group(state, &proposal);
                } else if let ProposalType::ChangeDaoConfig = proposal.proposal_type {
                    chnage_dao_config(state, &proposal);
                } else if let ProposalType::ChnageDaoPolicy = proposal.proposal_type {
                    change_dao_policy(state, &proposal);
                } else if let ProposalType::TokenTransfer = proposal.proposal_type {
                    let _ = transfer_token(&proposal);
                }
            }
            state.proposals.insert(proposal.proposal_id.clone(), proposal);
        }
    });
}

fn add_member_to_dao(state: &mut State, proposal: &Proposals) {
    let dao = &mut state.dao;
    dao.members.push(proposal.principal_of_action);
    dao.members_count += 1;
    ic_cdk::println!("add_member_to_dao me aa gya");
}

fn add_member_to_group(state: &mut State, proposal: &Proposals) {
    let dao_groups = &mut state.dao_groups;
    if let Some(group_to_join) = &proposal.group_to_join {
        if let Some(mut dao_group) = dao_groups.get(group_to_join) {
            dao_group.group_members.push(proposal.principal_of_action);
            dao_groups.insert(group_to_join.clone(), dao_group);
        }
    }
}

fn remove_member_from_dao(state: &mut State, proposal: &Proposals) {
    let dao = &mut state.dao;
    dao.members.retain(|s| s != &proposal.principal_of_action);
    dao.members_count -= 1;
}

fn remove_member_to_group(state: &mut State, proposal: &Proposals) {
    let dao_groups = &mut state.dao_groups;
    if let Some(group_to_remove) = &proposal.group_to_remove {
        if let Some(mut dao_group) = dao_groups.get(group_to_remove) {
            dao_group.group_members.retain(|s| s != &proposal.principal_of_action);
            dao_groups.insert(group_to_remove.clone(), dao_group);
        }
    }
}

fn chnage_dao_config(state: &mut State, proposal: &Proposals) {
    let dao = &mut state.dao;
    if let Some(ref new_dao_name) = proposal.new_dao_name {
        dao.dao_name = new_dao_name.clone();
        ic_cdk::println!("chnage_dao_config me aa gya 1");
    }
    if let Some(ref purpose) = proposal.new_dao_purpose {
        dao.purpose = purpose.clone();
        ic_cdk::println!("chnage_dao_config me aa gya 2");
    }
    if let Some(ref daotype) = proposal.new_daotype {
        dao.daotype = daotype.clone();
        ic_cdk::println!("chnage_dao_config me aa gya 3");
    }
}

fn change_dao_policy(state: &mut State, proposal: &Proposals) {
    if let Some(cool_down_period) = proposal.cool_down_period {
        state.dao.cool_down_period = cool_down_period;
        ic_cdk::println!("change_dao_policy me aa gya 1");
    }
    ic_cdk::println!("change_dao_policy me aa gya 2");
    state.dao.required_votes = proposal.required_votes;
}

async fn transfer_token(proposal: &Proposals) -> Result<String, String> {
    let principal_id: Principal = api::caller();
    ic_cdk::println!("transfer_token me aa gya 1");
    let balance = icrc_get_balance(principal_id)
        .await
        .map_err(|err| format!("Error while fetching user balance: {}", err))?;

    if balance <= 0 as u8 {
        return Err(String::from(
            "User token balance is less than the required transfer tokens",
        ));
    }

    let from = match &proposal.from {
        Some(principal) => principal,
        None => return Err(String::from("Missing 'from' principal")),
    };

    let to = match &proposal.to {
        Some(principal) => principal,
        None => return Err(String::from("Missing 'to' principal")),
    };
    let tokens = match proposal.tokens {
        Some(tokens) => tokens,
        None => return Err(String::from("Missing token amount")),
    };

    let token_transfer_args = TokenTransferArgs {
        from: *from,
        to: *to,
        tokens,
    };

    icrc_transfer(token_transfer_args)
        .await
        .map_err(|err| format!("Error in transfer of tokens: {}", String::from(err)))?;

    Ok("Token transfer SuccessFully".to_string())
}

#[init]
async fn init(dao_input: DaoInput) {
    // ic_cdk::println!("data is {:?}", dao_input);

    // let principal_id = api::caller();
    let new_dao = Dao {
        dao_id: ic_cdk::api::id(),
        dao_name: dao_input.dao_name,
        purpose: dao_input.purpose,
        daotype: dao_input.daotype,
        image_canister: dao_input.image_canister,
        link_of_document: dao_input.link_of_document,
        cool_down_period: dao_input.cool_down_period,
        // tokenissuer: dao_input.tokenissuer,
        linksandsocials: dao_input.linksandsocials,
        // group_name: vec!["council".to_string()],
        groups_count: dao_input.dao_groups.len() as u64,
        required_votes: dao_input.required_votes,
        members: dao_input.members.clone(),
        image_id: dao_input.image_id,
        members_count: dao_input.members.len() as u32,
        followers: dao_input.followers.clone(),
        members_permissions: dao_input.members_permissions,
        followers_count: dao_input.followers.len() as u32,
        proposals_count: 0,
        proposal_ids: Vec::new(),
        token_ledger_id: LedgerCanisterId {
            id: Principal::anonymous(),
        }, // dao_groups: dao_input.dao_groups.clone(), // to be removed (debug impl)
        tokens_required_to_vote: dao_input.tokens_required_to_vote,
        total_tokens: dao_input.token_supply,
        daohouse_canister_id: dao_input.daohouse_canister_id,
        token_symbol: dao_input.token_symbol,
    };

    // let permission = Votingandpermissions {
    //     changedao_config: "council".to_string(),
    //     changedao_policy: "council".to_string(),
    //     bounty: "council".to_string(),
    //     bountydone: "council".to_string(),
    //     transfer: "council".to_string(),
    //     polls: "council".to_string(),
    //     removemembers: "council".to_string(),
    //     addmembers: "council".to_string(),
    //     functioncall: "council".to_string(),
    //     upgradeself: "council".to_string(),
    //     upgraderemote: "council".to_string(),
    //     setvotetoken: "council".to_string(),
    //     votingpermision: "council".to_string(),
    // };

    // let council_list = GroupList {
    //     users: dao_input.members,
    // };

    with_state(|state| {
        state.dao = new_dao.clone();

        for x in dao_input.dao_groups.iter() {
            state.dao_groups.insert(x.group_name.clone(), x.to_owned());
        }
        // state.dao_groups.insert(dao_input.dao_groups., value)
        // for x in dao_i
        // state.permision = permission.clone();
        // state.groups.insert("council".to_string(), council_list);
    });

    start_proposal_checker();
}

// #[pre_upgrade]
// fn pre_upgrade() {
//     upgrade::pre_upgrade();
// }

// #[post_upgrade]
// fn post_upgrade() {
//     upgrade::post_upgrade();
// }

export_candid!();
