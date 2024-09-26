use crate::proposal_route::check_proposal_state;
use crate::types::{Dao, Proposals};
use crate::{guards::*, Comment, DaoGroup, Pagination, ProposalStakes, ReplyCommentArgs};
use crate::{with_state, ProposalState, VoteParam};
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::{self};
use ic_cdk::{query, update};
use sha2::{Digest, Sha256};
use std::collections::HashSet;

// #[update(guard=check_members)]
// pub async fn create_proposal(daohouse_backend_id: Principal, proposal: ProposalInput) -> String {
//     let uuids = raw_rand().await.unwrap().0;
//     with_state(  move | state| async {
//         let proposal_id = format!("{:x}", Sha256::digest(&uuids));
//         proposal_route::create_new_proposal(state, proposal.clone(), proposal_id.clone(), daohouse_backend_id.clone());
//     }).await;

//     // let _res: CallResult<(String,)> = ic_cdk::call(
//     //     daohouse_backend_id,
//     //     "update_proposal_count",
//     //     (),
//     // )
//     // .await;

//     String::from("value")
//     // response
// }

#[update(guard = prevent_anonymous)]
fn get_all_proposals(page_data: Pagination) -> Vec<Proposals> {
    with_state(|state| {
        let mut proposals: Vec<Proposals> = Vec::with_capacity(state.proposals.len() as usize);
        let all_proposals = &state.proposals;

        for (_, v) in all_proposals.iter() {
            proposals.push(v.clone());
        }
        let ending = proposals.len();

        if ending == 0 {
            return proposals;
        }

        let start = page_data.start as usize;
        let end = page_data.end as usize;
        if start < ending {
            let end = end.min(ending);
            return proposals[start..end].to_vec();
        }

        Vec::new()
    })
}

// get user specific user
#[update(guard=prevent_anonymous)]
fn get_my_proposal() -> Result<Vec<Proposals>, String> {
    // with_state(|state| state.proposals.)

    with_state(|state| {
        let mut proposals: Vec<Proposals> = Vec::new();

        for v in state.proposals.iter() {
            if v.1.created_by == api::caller() {
                proposals.push(v.1.clone());
            }
        }
        Ok(proposals)
    })
}

#[update(guard=prevent_anonymous)]
async fn get_proposal_by_id(proposal_id: String) -> Proposals {
    with_state(|state| state.proposals.get(&proposal_id).unwrap().clone())
}

// #[query]
// async fn get_dao_detail() -> Dao {
//     with_state(|state| state.dao.clone())
// }

// get Dao details with unique members always

#[update(guard=prevent_anonymous)]
async fn get_dao_detail() -> Dao {
    with_state(|state| {
        let mut dao = state.dao.clone();
        let unique_members: HashSet<candid::Principal> = dao.members.iter().cloned().collect();
        dao.members = unique_members.into_iter().collect();
        dao.members_count = dao.members.len() as u32;
        dao
    })
}

#[update(guard = guard_check_members)]
fn change_proposal_state(
    proposal_id: String,
    proposal_state: ProposalState,
) -> Result<String, String> {
    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            pro.proposal_status = proposal_state;
            state.proposals.insert(proposal_id, pro.to_owned());
            Ok(format!("State changed to {:?} ", pro.proposal_status))
        }
        None => Err(String::from("Proposal does not exist.")),
    })
}

#[update(guard = prevent_anonymous)]
async fn comment_on_proposal(comment: String, proposal_id: String) -> Result<String, String> {
    let uuids = raw_rand().await.unwrap().0;
    let comment_id = format!("{:x}", Sha256::digest(&uuids));

    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            pro.comments_list.push(Comment {
                author_principal: ic_cdk::api::caller(),
                comment_id,
                comment_text: comment,
                created_at: ic_cdk::api::time(),
                likes: 0,
                replies: vec![],
            });
            pro.comments += 1;
            state.proposals.insert(proposal_id, pro.to_owned());
            Ok(String::from("Comment was sucessfully added"))
        }
        None => Err(String::from("Proposal does not exist.")),
    })
}

#[update(guard = prevent_anonymous)]
async fn reply_comment(args: ReplyCommentArgs) -> Result<String, String> {
    let proposal = match with_state(|state| state.proposals.get(&args.proposal_id)) {
        Some(val) => val,
        None => {
            return Err(String::from(
                "No proposal associated with the following proposal ID",
            ))
        }
    };

    let mut updated_comment_list = proposal.comments_list.clone();

    for com in updated_comment_list.iter_mut() {
        if com.comment_id == args.comment_id.clone() {
            com.replies.push(args.comment.clone());
            break;
        }
    }

    let updated_proposal = Proposals {
        comments: proposal.comments + 1,
        comments_list: updated_comment_list,
        ..proposal
    };

    with_state(|state| {
        state
            .proposals
            .insert(updated_proposal.proposal_id.clone(), updated_proposal)
    });

    Ok(String::from("Successfully commented on post"))
}

// #[update(guard=prevent_anonymous)]
// async fn like_comment(args: CommentLikeArgs) {
//     with_state(|state| match state.proposals.get(&args.proposal_id) {
//         Some(val) => {
//             for comment in val.comments_list.iter() {
//                 if comment == args.comment_id {

//                 }
//             }
//         },
//         None => Err(String::from("No proposal found with following ID")),

//     })
// }

fn refresh_proposals(id: &String) {
    with_state(|state| match &mut state.proposals.get(&id) {
        Some(proposal) => {
            if check_proposal_state(&proposal.proposal_expired_at) {
                proposal.proposal_status = ProposalState::Expired;
                state.proposals.insert(id.clone(), proposal.to_owned());

                // Ok(format!("Updated {:?}", proposal))
            }
        }
        None => (),
    })
}

#[update]
fn proposal_refresh() -> Result<String, String> {
    let mut ids: Vec<String> = Vec::new();

    with_state(|state| {
        // ic_cdk::println!("loop ke aandar");

        //    let abc: Vec<String> = state.dao.proposal_ids.iter().collect();
        ids = state.dao.proposal_ids.clone();
    });

    for id in ids.iter() {
        execute_add_proposals(id);
        refresh_proposals(id);
    }

    Ok("Refresh completed".to_string())
}

// #[update(guard = prevent_anonymous)]
// fn vote(proposal_id: String, voting: VoteParam) -> Result<String, String> {
//     check_voting_right(&proposal_id)?;
//     let principal_id = api::caller();

//     with_state(|state| match &mut state.proposals.get(&proposal_id) {
//         Some(pro) => {
//             if voting == VoteParam::Yes {
//                 pro.approved_votes_list.push(principal_id);
//                 pro.proposal_approved_votes += 1;

//                 state.proposals.insert(proposal_id, pro.to_owned());
//                 Ok(String::from("Successfully voted in favour of Proposal."))
// } else {
//     pro.rejected_votes_list.push(principal_id);
//     pro.proposal_rejected_votes += 1;

//     state.proposals.insert(proposal_id, pro.to_owned());
//     Ok(String::from("Successfully voted against the proposal."))
// }
//         }
//         None => Err(String::from("Proposal ID is invalid !")),
//     })
// }

// #[update]
// // only members
// // prevent anonymous
// // TODO: SAVE THE TRANSFERED TOKES TO PARTICULAR CANISTER AND REVERT IT BACK WHEN COMPLETED
// async fn vote(proposal_id: String, voting: VoteParam) -> Result<String, String> {
//     // to check if user has already voted
//     check_voting_right(&proposal_id)?;

//     let principal_id = api::caller();

//     // user balance validation
//     let balance = icrc_get_balance(principal_id)
//         .await
//         .map_err(|err| format!("Error while fetching user balance {}", err))?;

//     let min_vote_req = with_state(|state| state.dao.tokens_required_to_vote);

//     if balance < min_vote_req {
//         return Err(String::from(
//             "User token balance is less then the required threshold",
//         ));
//     } else {
//         // frontend need to approve
//         // transfer of tokens
//         let token_transfer_args = TokenTransferArgs {
//             from: principal_id,
//             to: ic_cdk::api::id(),
//             tokens: min_vote_req as u64,
//         };
//         icrc_transfer(token_transfer_args)
//             .await
//             .map_err(|err| format!("Error in transfer of tokens: {}", String::from(err)))?;

//         // storing staked tokens
//         with_state(|state| {
//             let account_balance = AccountBalance {
//                 id: principal_id.clone(),
//                 staked: state.dao.tokens_required_to_vote,
//             };

//             let proposal_stake = ProposalStakes {
//                 proposal_id: proposal_id.clone(),
//                 balances: vec![account_balance],
//             };

//             state
//                 .proposal_balances
//                 .insert(proposal_id.clone(), proposal_stake);
//         });

//         // perform voting
//         with_state(|state| match &mut state.proposals.get(&proposal_id) {
//             Some(pro) => {
//                 if voting == VoteParam::Yes {
//                     pro.approved_votes_list.push(principal_id);
//                     pro.proposal_approved_votes += 1;

//                     state.proposals.insert(proposal_id, pro.to_owned());
//                     Ok(String::from("Successfully voted in favour of Proposal."))
//                 } else {
//                     pro.rejected_votes_list.push(principal_id);
//                     pro.proposal_rejected_votes += 1;

//                     state.proposals.insert(proposal_id, pro.to_owned());
//                     Ok(String::from("Successfully voted against the proposal."))
//                 }
//             }
//             None => Err(String::from("Proposal ID is invalid !")),
//         })
//     }

//     // Ok("()".to_string())
// }

#[update]
async fn vote(proposal_id: String, voting: VoteParam) -> Result<String, String> {
    // check_voting_right(&proposal_id)?;

    let principal_id = api::caller();
    with_state(|state| match &mut state.proposals.get(&proposal_id) {
        Some(pro) => {
            if pro.proposal_status == ProposalState::Open {
                if voting == VoteParam::Yes {
                    pro.approved_votes_list.push(principal_id);
                    pro.proposal_approved_votes += 1;
                    state.proposals.insert(proposal_id, pro.to_owned());
                    Ok(String::from("Successfully voted in favour of Proposal."))
                } else {
                    pro.rejected_votes_list.push(principal_id);
                    pro.proposal_rejected_votes += 1;
                    state.proposals.insert(proposal_id, pro.to_owned());
                    Ok(String::from("Successfully voted against the proposal."))
                }
            } else {
                Err(format!("Proposal has been {:?} ", pro.proposal_status))
            }
        }
        None => Err(String::from("Proposal ID is invalid !")),
    })
}

#[query(guard=prevent_anonymous)]
fn search_proposal(proposal_id: String) -> Vec<Proposals> {
    let mut propo: Vec<Proposals> = Vec::new();

    with_state(|state| {
        for y in state.proposals.iter() {
            if y.1.proposal_id == proposal_id {
                propo.push(y.1)
            }
        }

        propo
    })
}

// #[query]
fn execute_add_proposals(id: &String) {
    with_state(|state| match state.proposals.get(&id) {
        Some(val) => {
            let is_completed = val.proposal_approved_votes + val.proposal_rejected_votes
                >= val.required_votes as u64;

            let is_success = val.proposal_approved_votes >= 5;
            if is_completed && is_success {
                let mut updated_proposal = val.clone();

                let mut updated_dao = state.dao.clone();
                updated_dao.members.push(val.created_by);
                updated_dao.members_count += 1;

                state.dao = updated_dao;
                updated_proposal.proposal_status = ProposalState::Accepted;
                state.proposals.insert(id.to_owned(), updated_proposal);
            } else {
                let mut updated_proposal = val.clone();

                updated_proposal.proposal_status = ProposalState::Rejected;
                state.proposals.insert(id.to_owned(), updated_proposal);
            }
        }
        None => (),
    })

    // with_state(|state| match &mut state.proposals.get(&id) {
    //     Some(proposal) => {

    //         let is_completed = proposal.proposal_approved_votes+ proposal.proposal_rejected_votes >= proposal.required_votes as u64;

    //         if is_completed {
    //             state.dao.members.push(proposal.created_by);
    //             proposal.proposal_status = ProposalState::Expired;
    //             state.proposals.insert(id.clone(), proposal.to_owned());

    //             // Ok(format!("Updated {:?}", proposal))
    //         }
    //     }
    //     None => (),
    // })
}

// get all groups
#[update]
fn get_all_groups() -> Vec<DaoGroup> {
    with_state(|state| {
        let mut groups: Vec<DaoGroup> = Vec::new();

        for x in state.dao_groups.iter() {
            groups.push(x.1);
        }
        groups
    })
}

// TODO debug functions

// to get all stakes
#[query]
fn get_all_balances(proposal_id: String) -> ProposalStakes {
    with_state(|state| state.proposal_balances.get(&proposal_id).unwrap())
}

// get all groups
// #[query]
// fn get_all_members() {
//   with_state(|state| state.groups)
// }
