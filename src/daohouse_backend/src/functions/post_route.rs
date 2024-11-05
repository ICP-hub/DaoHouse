// use std::collections::BTreeMap;
use crate::{with_state, Analytics, DaoDetails, Pagination};
use ic_cdk::api;

use crate::guards::*;
use ic_cdk::query;

#[query(guard = prevent_anonymous)]
fn get_all_dao(page_data: Pagination) -> Vec<DaoDetails> {
    let mut daos: Vec<DaoDetails> = Vec::new();

    with_state(|state| {
        for y in state.dao_details.iter() {
            daos.push(y.1);
        }
    });

    let ending = daos.len();

    if ending == 0 {
        return daos;
    }

    let start = page_data.start as usize;
    let end = page_data.end as usize;

    if start < ending {
        let end = end.min(ending);
        return daos[start..end].to_vec();
    }
    Vec::new()

    // daos
}

#[query]
fn get_analytics() -> Result<Analytics, String> {
    with_state(|state| {
        let data = state.analytics_content.get(&0);

        match data {
            Some(res) => Ok(res),
            None => Err("data not found !!!!!".to_string()),
        }
    })
}

#[query]
fn get_cycles() -> u64 {
    api::canister_balance()
}

#[query(guard = prevent_anonymous)]
fn search_dao(dao_name: String) -> Vec<DaoDetails> {
    let mut daos: Vec<DaoDetails> = Vec::new();

    with_state(|state| {
        for y in state.dao_details.iter() {
            if y.1.dao_name.contains(&dao_name) {
                daos.push(y.1.clone())
            }
        }

        daos
    })
}

