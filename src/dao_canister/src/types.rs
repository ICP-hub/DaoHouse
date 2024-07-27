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
    Expired
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
    pub comments: u64,
    // pub comments_list:Vec<Comment>,
    pub comments_list: Vec<String>,

    pub share_count: u64,
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct ProposalInput {
    pub proposal_title: String,
    pub proposal_description: String,
    pub required_votes: u32,
    // pub proposal_amount:String,
    // pub proposal_receiver_id:String,
    // pub created_by: Principal,
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct Dao {
    pub dao_id: Principal,
    pub dao_name: String,
    pub purpose: String,
    pub daotype: String,
    pub link_of_document: String,
    pub cool_down_period: String,
    pub tokenissuer: String,
    pub linksandsocials: Vec<String>,
    pub required_votes: i8,
    pub groups_count: u64,
    pub group_name: Vec<String>,
    pub image_id: String,
    pub members: Vec<Principal>,
    pub members_count: u32,
    pub followers: Vec<Principal>,
    pub members_permissions: Vec<String>,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Debug)]
pub struct DaoInput {
    pub dao_name: String,
    pub purpose: String,
    pub daotype: String,
    pub link_of_document: String,
    pub cool_down_period: String,
    pub members: Vec<Principal>,
    pub tokenissuer: String,
    pub linksandsocials: Vec<String>,
    pub required_votes: i8,
    pub image_id: String,
    pub followers: Vec<Principal>,
    pub members_permissions: Vec<String>,
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

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct GroupList {
    pub users: Vec<Principal>,
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct Votingandpermissions {
    pub changedao_config: String,
    pub changedao_policy: String,
    pub bounty: String,
    pub bountydone: String,
    pub transfer: String,
    pub polls: String,
    pub removemembers: String,
    pub addmembers: String,
    pub functioncall: String,
    pub upgradeself: String,
    pub upgraderemote: String,
    pub setvotetoken: String,
    pub votingpermision: String,
}

#[derive(Clone, CandidType, Serialize, Deserialize, PartialEq)]
pub enum VoteParam {
    Yes,
    No,
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

impl Storable for GroupList {
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
