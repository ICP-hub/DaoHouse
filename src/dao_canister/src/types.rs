use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};
// use serde::Deserialize;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(Clone, Debug, CandidType, Deserialize, PartialEq)]
pub enum ProposalState {
    Open,
    Accepted,
    Rejected,
    Executing,
    Succeeded,
    Expired,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum ProposalType {
    AddMemberProposal,
    RemoveMemberPrposal,
    VotingProposal,
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct AccountBalance {
    pub id: Principal,
    // pub balance: u32,
    pub staked: u32
}

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct ProposalStakes {
    pub proposal_id: String,
    pub balances: Vec<AccountBalance>,
    // pub staked_balances: Vec<AccountBalance>,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct Proposals {
    pub proposal_id: String,
    pub proposal_title: String,
    pub proposal_description: String,
    pub proposal_status: ProposalState,
    // pub proposal_amount:String,
    pub proposal_submitted_at: u64,
    pub proposal_expired_at: u64,
    // pub proposal_receiver_id:String,
    pub proposal_approved_votes: u64,
    pub approved_votes_list: Vec<Principal>,
    pub proposal_rejected_votes: u64,
    pub rejected_votes_list: Vec<Principal>,
    pub required_votes: u32,
    pub created_by: Principal,
    pub comments: u32,
    pub likes: u32,
    // pub comments_list:Vec<Comment>,
    pub comments_list: Vec<Comment>,
    pub proposal_type: ProposalType,
    pub share_count: u64,
    pub principal_of_action: Principal // principal id of user who is to be added, removed, transfered funds
}

// for proposal comments
#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct Comment {
    pub author_principal: Principal,
    pub comment_text: String,
    pub comment_id: String,
    pub replies: Vec<String>,
    pub likes: u16,
    pub created_at: u64
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct ProposalInput {
    pub proposal_title: String,
    pub proposal_description: String,
    // pub required_votes: u32,
    pub proposal_type: ProposalType,
    pub principal_of_action: Option<Principal> // principal id of user who is to be added, removed, transfered funds

    // pub proposal_expired_at: u64,
    // pub proposal_amount:String,
    // pub proposal_receiver_id:String,
    // pub created_by: Principal,
}

// #[derive(Clone, CandidType, Serialize, Deserialize)]
// pub struct NewProposal {
//     pub proposal_title: String,
//     pub proposal_description: String,
//     pub required_votes: u32,
//     pub proposal_type: ProposalType,
//     // pub proposal_expired_at: u64,
//     // pub proposal_amount:String,
//     // pub proposal_receiver_id:String,
//     // pub created_by: Principal,
// }

#[derive(CandidType, Serialize, Deserialize)]
pub struct Pagination {
    pub start: u32,
    pub end: u32,
}

#[derive(CandidType, Serialize, Deserialize)]
pub struct CommentLikeArgs {
    pub proposal_id: String,
    pub comment_id: String    
}


#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct ReplyCommentArgs {
    pub proposal_id: String,
    pub comment_id: String ,
    pub comment: String  
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct LedgerCanisterId {
    pub id: Principal,
}
#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct Dao {
    pub dao_id: Principal,
    pub dao_name: String,
    pub purpose: String,
    pub daotype: String,
    pub link_of_document: String,
    pub cool_down_period: u32,
    // pub tokenissuer: String,
    pub linksandsocials: Vec<String>,
    pub required_votes: u32,
    pub groups_count: u64,
    // pub group_name: Vec<String>,
    pub image_canister: Principal,
    pub image_id: String,
    pub members: Vec<Principal>,
    pub members_count: u32,
    pub followers: Vec<Principal>,
    pub members_permissions: Vec<String>,
    pub followers_count: u32,
    pub proposals_count: u32,
    pub proposal_ids: Vec<String>,
    pub token_ledger_id: LedgerCanisterId,
    pub total_tokens: u32,
    pub token_symbol: String,
    pub tokens_required_to_vote: u32, // pub dao_groups: Vec<DaoGroup>,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct DaoGroup {
    pub group_name: String,
    pub group_members: Vec<Principal>,
    pub group_permissions: Vec<String>,
    pub quorem: u8,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct DaoInput {
    pub dao_name: String,
    pub purpose: String,
    pub daotype: String,
    pub link_of_document: String,
    pub cool_down_period: u32,
    pub members: Vec<Principal>,
    // pub tokenissuer: String,
    pub linksandsocials: Vec<String>,
    pub required_votes: u32,
    pub dao_groups: Vec<DaoGroup>,
    pub image_canister: Principal,
    pub image_id: String,
    pub followers: Vec<Principal>,
    pub members_permissions: Vec<String>,
    pub tokens_required_to_vote: u32,
    pub token_symbol: String,
    pub token_supply: u32,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct UpdateDaoSettings {
    pub dao_name: String,
    pub purpose: String,
    pub daotype: String,
    pub link_of_document: String,
    // pub cool_down_period: String,
    pub linksandsocials: Vec<String>,
    // pub required_votes: i8,
    pub members: Vec<Principal>,
    pub followers: Vec<Principal>,
}

// #[derive(Clone, CandidType, Serialize, Deserialize)]
// pub struct GroupList {
//     pub users: Vec<Principal>,
// }

// #[derive(Clone, CandidType, Serialize, Deserialize)]
// pub struct Votingandpermissions {
//     pub changedao_config: String,
//     pub changedao_policy: String,
//     pub bounty: String,
//     pub bountydone: String,
//     pub transfer: String,
//     pub polls: String,
//     pub removemembers: String,
//     pub addmembers: String,
//     pub functioncall: String,
//     pub upgradeself: String,
//     pub upgraderemote: String,
//     pub setvotetoken: String,
//     pub votingpermision: String,
// }

#[derive(Clone, CandidType, Serialize, Deserialize, PartialEq)]
pub enum VoteParam {
    Yes,
    No,
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct TokenTransferArgs {
    pub tokens: u64,
    pub from: Principal,
    pub to: Principal,
    // pub dao_canister: Principal
}

#[derive(CandidType, Serialize, Deserialize)]
pub struct TokenBalanceArgs {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

// #[derive(Clone, CandidType, Serialize, Deserialize)]
// pub struct Vote {
//     vote_param: VoteParam,
// }

const MAX_VALUE_SIZE: u32 = 600;

impl Storable for Proposals {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

// impl Storable for GroupList {
//     fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }

//     fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }

//     const BOUND: Bound = Bound::Bounded {
//         max_size: MAX_VALUE_SIZE,
//         is_fixed_size: false,
//     };
// }

impl Storable for DaoGroup {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

impl Storable for ProposalStakes {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}
