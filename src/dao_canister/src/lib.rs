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
use std::time::Duration;
use ic_cdk_timers::set_timer_interval;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::new());
}

pub fn with_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

const EXPIRATION_TIME: u64 = 1 * 60 * 1_000_000_000;

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
            let total_percentage = (proposal.proposal_approved_votes as f64
                / proposal.required_votes as f64)
                * 100.0;

            let mut proposal = proposal.clone();
            if time_diff >= EXPIRATION_TIME {
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

        for proposal in proposals_to_update {
            if proposal.proposal_status == ProposalState::Accepted {
                if let ProposalType::AddMemberProposal = proposal.proposal_type {
                    add_member_to_dao(state, &proposal);
                }
                else if let ProposalType::RemoveMemberPrposal = proposal.proposal_type {
                    // remove_member_from_dao();
                }
                else if let ProposalType::ChangeDaoConfig = proposal.proposal_type {
                    // chnage_dao_config();
                }
                else if let ProposalType::ChnageDaoPolicy = proposal.proposal_type {
                    // chnage_dao_policy();
                }
                else if let  ProposalType::TokenTransfer = proposal.proposal_type {
                    // transfer_token();
                }
            }
            state.proposals.insert(proposal.proposal_id.clone(), proposal);
        }
    });
}

fn add_member_to_dao(state: &mut State, proposal: &Proposals) {
    if let ProposalType::AddMemberProposal = proposal.proposal_type {
        let dao = &mut state.dao;
        if !dao.members.contains(&proposal.principal_of_action) {
            dao.members.push(proposal.principal_of_action);
            dao.members_count += 1;
        }
    }
}

fn remove_member_from_dao(state: &mut State,proposal: &Proposals){
    let dao = &mut state.dao;
    if dao.members.contains(&proposal.principal_of_action) {
        dao.members.retain(|s| s != &proposal.principal_of_action);
        dao.members_count -= 1;
    }
}

fn chnage_dao_config(args: crate::types::ChangeDaoConfigArg, state: &mut State,){
    let dao = &mut state.dao;
    dao.dao_name = args.dao_name;
    dao.purpose = args.purpose;
    dao.daotype = args.daotype;
}

fn chnage_dao_policy(state: &mut State, args: crate::types::ChangeDaoPolicyArg){
    state.dao.cool_down_period = args.cool_down_period;
    state.dao.required_votes = args.required_votes;
}

async fn transfer_token(args: crate::types::TokenTransferArgs) -> Result<String, String>{
    let principal_id: Principal = api::caller();
    
    let balance = icrc_get_balance(principal_id)
        .await
        .map_err(|err| format!("Error while fetching user balance {}", err))?;
    if balance <= 0 as u8 {
        ic_cdk::println!("user balance : {} ", balance);
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
