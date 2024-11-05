use candid::Principal;
use ic_cdk::api;

use crate::with_state;

// middleware guard to prevent anonymous user
pub fn prevent_anonymous() -> Result<(), String> {
    if api::caller() == Principal::anonymous() {
        return Err(String::from(crate::utils::ANONYMOUS_USER));
    }
    Ok(())
}

// check user existance
pub fn check_for_user_guard(user: &Principal) -> Result<(), String> {
    prevent_anonymous()?;
    if with_state(|state| state.user_profile.contains_key(&user)) {
        return Ok(());
    } else {
        return Err(String::from(crate::utils::USER_DOES_NOT_EXIST));
    }
}

// pub fn guard_parent_canister_only() -> Result<(), String> {
//     prevent_anonymous()?;
//     with_state(|state| match state.canister_meta_data.get(&0) {
//         Some(val) => {
//             if val.canister_ids[core::constants::ESSENTIAL_POST_PARENT_CANISTER]
//                 == ic_cdk::api::caller()
//             {
//                 return Ok(());
//             } else {
//                 return Err(String::from(core::constants::WARNING_ADMIN_ONLY));
//             };
//         }
//         None => {
//             return Err(String::from(
//                 core::constants::ERROR_FAILED_CANISTER_DATA,
//             ))
//         }
//     })
// }
