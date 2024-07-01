// use std::collections::HashMap;
use ic_stable_structures::StableBTreeMap;
use crate::Memory;
use candid::Principal;
use crate::types::{UserProfile,PostInfo};
// use std::collections::BTreeMap;



pub struct State {

    pub user_profile : StableBTreeMap<Principal, UserProfile,Memory>,

    pub post_detail:StableBTreeMap<String,PostInfo,Memory>,

    // pub dao_details: StableBTreeMap<Str>
    

    // pub users: HashMap<Principal, User>,
}

impl State {
    pub fn new() -> Self {
        Self {

            user_profile: init_file_contents(),
            // users: HashMap::new(),
            post_detail:post_file_contents()
        }
    }
}




fn init_file_contents() -> StableBTreeMap<Principal, UserProfile,Memory> {
    StableBTreeMap::init(crate::memory::get_postdata_memory())

}

fn post_file_contents() -> StableBTreeMap<String,PostInfo,Memory> {
    StableBTreeMap::init(crate::memory::get_user_memory())

}

impl Default for State {
    fn default() -> Self {
        State::new()
    }
}