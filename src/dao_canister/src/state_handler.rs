use crate::Memory;
use candid::Principal;
use ic_stable_structures::StableBTreeMap;
use crate::types::{Dao, GroupList, Proposals, Votingandpermissions};
// use std::collections::BTreeMap;


pub struct State {

    pub proposals : StableBTreeMap<String, Proposals,Memory>,
    pub dao:Dao,
    pub permision:Votingandpermissions,
    pub groups:StableBTreeMap<String,GroupList,Memory>


    // pub users: HashMap<Principal, User>,
}

impl State {
    pub fn new() -> Self {
        Self {
            proposals: init_user_data(),
            dao: Dao {
                dao_id: Principal::anonymous(), 
                dao_name: String::from("Example DAO"),
                purpose:String::from("Example Purpose"),
                daotype:String::from("Example Type"),
                link_of_document:String::from("Example Document"),
                cool_down_period:String::from("Example Cooldown"),
                tokenissuer:String::from("Example Token Issuer"), 
                linksandsocials:Vec::new(),
                required_votes:0,
                groups_count:0,
                group_name:Vec::new(),
                members: Vec::new()
            },

            permision:Votingandpermissions{
                changedao_config: "council".to_string(),
                changedao_policy: "council".to_string(),
                bounty: "council".to_string(),
                bountydone: "council".to_string(),
                transfer: "council".to_string(),
                polls: "council".to_string(),
                removemembers: "council".to_string(),
                addmembers: "council".to_string(),
                functioncall: "council".to_string(),
                upgradeself: "council".to_string(),
                upgraderemote: "council".to_string(),
                setvotetoken: "council".to_string(),
                votingpermision: "council".to_string(),
            },

            groups:init_pool_data(),
        }
    }
}

impl Default for State {
    fn default() -> Self {
        State::new()
    }
}


fn init_user_data() -> StableBTreeMap<String, Proposals,Memory> {
    StableBTreeMap::init(crate::memory::get_postdata_memory())

}
fn init_pool_data() -> StableBTreeMap<String,GroupList,Memory> {
    StableBTreeMap::init(crate::memory::get_pool_data_memory())
}