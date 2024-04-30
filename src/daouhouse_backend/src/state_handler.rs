use std::collections::HashMap;
use candid::Principal;
use serde::{Serialize,Deserialize};
use crate::types::UserProfile;
// use std::collections::BTreeMap;


#[derive(Serialize,Deserialize)]
pub struct State {

    pub user_profile : HashMap<Principal, UserProfile>,

    // pub users: HashMap<Principal, User>,
}

impl State {
    pub fn new() -> Self {
        Self {

            user_profile: HashMap::new(),
            // users: HashMap::new(),
        }
    }
}

impl Default for State {
    fn default() -> Self {
        State::new()
    }
}