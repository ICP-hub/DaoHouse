mod types;
use functions::{icrc_get_balance, icrc_transfer};
use ic_cdk::{export_candid, init};
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
use candid::Nat;
use ic_cdk::api::time;
use ic_cdk_timers::set_timer_interval;
use std::time::Duration;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

const EXPIRATION_TIME: u64 = 60 * 1_000_000_000;
fn start_proposal_checker() {
    set_timer_interval(Duration::from_secs(60), || {
        check_proposals();
    });
}

fn check_proposals() {
    with_state(|state: &mut State| {
        let timestamp = time();

        let proposal_ids: Vec<String> = state
            .proposals
            .iter()
            .filter_map(|(id, proposal)| {
                let time_diff = timestamp.saturating_sub(proposal.proposal_submitted_at);

                let should_process = time_diff >= EXPIRATION_TIME && !proposal.has_been_processed;

                // let should_process = time_diff >= proposal.proposal_expired_at && !proposal.has_been_processed;

                if should_process {
                    Some(id.clone())
                } else {
                    None
                }
            })
            .collect();

        for proposal_id in proposal_ids {
            if let Some(mut proposal) = state.proposals.get(&proposal_id) {
                proposal.has_been_processed = true;

                let proposal_approved_votes = proposal.proposal_approved_votes as f64;
                let proposal_rejected_votes = proposal.proposal_rejected_votes as f64;
                let total_votes: f64 = proposal_approved_votes + proposal_rejected_votes;
                let total_percentage = if total_votes > 0.0 {
                    (proposal_approved_votes / total_votes) * 100.0
                } else {
                    0.0
                };
                let time_diff = timestamp.saturating_sub(proposal.proposal_submitted_at);
                let min_require_vote = state.dao.required_votes as f64;
                let min_threshold = proposal.minimum_threadsold as f64;

                if total_votes >= min_require_vote {
                    if total_percentage >= min_threshold {
                        proposal.proposal_status = ProposalState::Accepted;
                        let clone_proposal = proposal.clone();
                        state.proposals.insert(proposal_id.clone(), clone_proposal);
                    } else if total_percentage > 0.0 {
                        proposal.proposal_status = ProposalState::Rejected;
                        let clone_proposal = proposal.clone();
                        state.proposals.insert(proposal_id.clone(), clone_proposal);
                    } else {
                        proposal.proposal_status = ProposalState::Expired;
                        let clone_proposal = proposal.clone();
                        state.proposals.insert(proposal_id.clone(), clone_proposal);
                    }
                } else {
                    proposal.proposal_status = ProposalState::Unreachable;
                    let clone_proposal = proposal.clone();
                    state.proposals.insert(proposal_id.clone(), clone_proposal);
                }

                if proposal.proposal_status == ProposalState::Accepted
                    && !proposal.has_been_processed_second
                {
                    ic_cdk::println!("status : {:?} ", proposal.proposal_status);
                    let proposal_clone = proposal.clone();
                    match proposal.proposal_type {
                        ProposalType::AddMemberToDaoProposal => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" add_member_to_dao ");
                                add_member_to_dao(state, &proposal);
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::AddMemberToGroupProposal => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" AddMemberToGroupProposal ");
                                add_member_to_group(state, &proposal);
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::RemoveMemberToDaoProposal => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" RemoveMemberToDaoProposal ");
                                remove_member_from_dao(state, &proposal);
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::RemoveMemberToGroupProposal => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" RemoveMemberToGroupProposal ");
                                remove_member_to_group(state, &proposal);
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::ChangeDaoConfig => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" ChangeDaoConfig ");
                                change_dao_config(state, &proposal);
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::ChangeDaoPolicy => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" ChangeDaoPolicy ");
                                change_dao_policy(state, &proposal);
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::TokenTransfer => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" TokenTransfer ");
                                let token_ledger_id:Principal  = state.dao.token_ledger_id.id;
                                ic_cdk::spawn(async move {
                                    transfer_tokens_to_user(token_ledger_id,&proposal_clone).await;
                                });
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::BountyRaised => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" BountyRaised ");
                                let token_ledger_id:Principal  = state.dao.token_ledger_id.id;
                                ic_cdk::spawn(async move {
                                    transfer_tokens_to_user(token_ledger_id,&proposal_clone).await;
                                });

                                if let Some(associate_proposal_id) =
                                    proposal.associated_proposal_id.clone()
                                {
                                    if let Some(mut data) =
                                        state.proposals.get(&associate_proposal_id)
                                    {
                                        data.proposal_status = ProposalState::Succeeded;

                                        state.proposals.insert(associate_proposal_id.clone(), data);
                                    }
                                }

                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        ProposalType::BountyDone => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" BountyDone ");
                                let token_ledger_id:Principal  = state.dao.token_ledger_id.id;
                                ic_cdk::spawn(async move {
                                    transfer_tokens_to_user(token_ledger_id, &proposal_clone).await;
                                });

                                if let Some(associate_proposal_id) =
                                    proposal.associated_proposal_id.clone()
                                {
                                    if let Some(mut data) =
                                        state.proposals.get(&associate_proposal_id)
                                    {
                                        data.proposal_status = ProposalState::Succeeded;

                                        state.proposals.insert(associate_proposal_id.clone(), data);
                                    }
                                }

                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        _ => {}
                    }
                }
                 else if !proposal.has_been_processed_second && time_diff >= EXPIRATION_TIME {
                //else if !proposal.has_been_processed_second && time_diff >= proposal.proposal_expired_at {
                    ic_cdk::println!("status : {:?} ", proposal.proposal_status);
                    let proposal_clone = proposal.clone();
                    match proposal.proposal_type {
                        ProposalType::TokenTransfer => {
                            if !proposal.has_been_processed_second {
                                ic_cdk::println!(" TokenTransfer unsucess ");
                                let token_ledger_id:Principal  = state.dao.token_ledger_id.id;
                                ic_cdk::spawn(async move {
                                    return_token_to_user(token_ledger_id, &proposal_clone).await;
                                });
                                proposal.has_been_processed_second = true;
                                state.proposals.insert(proposal_id.clone(), proposal);
                            }
                        }
                        _ => {}
                    }
                }
            }
        }
    });
}

fn add_member_to_dao(state: &mut State, proposal: &Proposals) {
    let dao = &mut state.dao;
    dao.members.push(proposal.principal_of_action);
    dao.members_count += 1;
}

fn add_member_to_group(state: &mut State, proposal: &Proposals) {
    if let Some(group_to_join) = &proposal.group_to_join {
        if let Some(mut dao_group) = state.dao_groups.get(group_to_join) {
            if !dao_group
                .group_members
                .contains(&proposal.principal_of_action)
            {
                dao_group.group_members.push(proposal.principal_of_action);
                state
                    .dao_groups
                    .insert(dao_group.group_name.clone(), dao_group);
            }
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
            dao_group
                .group_members
                .retain(|s| s != &proposal.principal_of_action);
            state
                .dao_groups
                .insert(dao_group.group_name.clone(), dao_group);
        }
    }
}

fn change_dao_config(state: &mut State, proposal: &Proposals) {
    let dao = &mut state.dao;
    if let Some(ref new_dao_name) = proposal.new_dao_name {
        dao.dao_name = new_dao_name.clone();
    }
    if let Some(ref purpose) = proposal.new_dao_purpose {
        dao.purpose = purpose.clone();
    }
    if let Some(ref daotype) = proposal.new_daotype {
        dao.daotype = daotype.clone();
    }
}

fn change_dao_policy(state: &mut State, proposal: &Proposals) {
    if let Some(cool_down_period) = proposal.cool_down_period {
        state.dao.cool_down_period = cool_down_period;
    }
    if let Some(new_required_votes) = proposal.new_required_votes {
        state.dao.required_votes = new_required_votes;
    }
}

async fn transfer_tokens_to_user(token_ledger_id: Principal, proposal: &Proposals) {
    ic_cdk::println!("we are transfering tokens : ");
    let token_from_user: Principal = match proposal.token_from.clone() {
        Some(token_from) => token_from,
        None => {
            ic_cdk::println!("Missing token amount");
            return;
        }
    };
    let balance: Nat = match icrc_get_balance(token_ledger_id.clone(),token_from_user).await {
        Ok(balance) => balance,
        Err(err) => {
            ic_cdk::println!("Error while fetching user balance: {}", err);
            return;
        }
    };
    let total_tokens: u64 = match proposal.tokens.clone() {
        Some(tokens) => tokens,
        None => {
            ic_cdk::println!("Missing token amount");
            return;
        }
    };
    if balance.clone() < total_tokens.clone() as u8 {
        ic_cdk::println!("Canister balance is less than the required transfer tokens");
        return;
    }
    let token_to_user: Principal = match proposal.token_to.clone() {
        Some(token_to) => token_to,
        None => {
            ic_cdk::println!("Missing token amount");
            return;
        }
    };
    ic_cdk::println!("from : {}", token_from_user.to_text());
    ic_cdk::println!("to : {}", token_to_user.to_text());
    let token_transfer_args = TokenTransferArgs {
        from : token_from_user.clone(),
        to : token_to_user.clone(),
        tokens : total_tokens.clone(),
    };
    
    if let Err(err) = icrc_transfer(token_ledger_id.clone(), token_transfer_args.clone()).await {
        ic_cdk::println!("Error in transfer of tokens: {}", err);
    } else {
        ic_cdk::println!("Token transfer completed successfully");
    }
}

async fn return_token_to_user(token_ledger_id: Principal, proposal: &Proposals) {
    let canister_wallet_id = ic_cdk::api::id();
    let balance = match icrc_get_balance(token_ledger_id.clone(), canister_wallet_id.clone()).await {
        Ok(balance) => balance,
        Err(err) => {
            ic_cdk::println!("Error while fetching user balance: {}", err);
            return;
        }
    };

    if balance <= 0 as u8 {
        ic_cdk::println!("User token balance is less than the required transfer tokens");
        return;
    }

    let tokens = match proposal.tokens.clone() {
        Some(tokens) => tokens,
        None => {
            ic_cdk::println!("Missing token amount");
            return;
        }
    };

    let token_to = match proposal.token_from.clone() {
        Some(token_to) => token_to,
        None => {
            ic_cdk::println!("Missing token amount");
            return;
        }
    };

    let token_transfer_args = TokenTransferArgs {
        from: canister_wallet_id.clone(),
        to: token_to.clone(),
        tokens,
    };

    if let Err(err) = icrc_transfer(token_ledger_id.clone(),token_transfer_args.clone()).await {
        ic_cdk::println!("Error in transfer of tokens: {}", err);
    } else {
        ic_cdk::println!("Token transfer completed successfully");
    }
}

#[init]
async fn init(dao_input: DaoInput) {
    let proposal_entry: Vec<crate::ProposalPlace> = dao_input
        .proposal_entry
        .iter()
        .map(|proposal| crate::ProposalPlace {
            place_name: proposal.place_name.clone(),
            min_required_thredshold: proposal.min_required_thredshold,
        })
        .collect();

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
        proposal_entry: proposal_entry,
        ask_to_join_dao : dao_input.ask_to_join_dao,
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

export_candid!();
