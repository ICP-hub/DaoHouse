use crate::types::{DaoInput, Profileinput, UserProfile};
use crate::{routes, with_state};
use ic_cdk::{query, update};

#[update]
async fn create_profile(profile: Profileinput) -> String {
    with_state(|state| routes::create_new_profile(state, profile.clone())).await
}

#[query]
async fn get_user_profile() -> UserProfile {
    with_state(|state| routes::get_user_profile(state)).await
}

#[update]
async fn update_profile(profile: Profileinput) -> String {
    with_state(|state| routes::update_profile(state, profile.clone())).await
}

#[update]
async fn delete_profile() -> String {
    with_state(|state| routes::delete_profile(state)).await
}

// #[update]
// async fn create_newdao(dao_detail: DaoInput) -> String {
//     let result = with_state(async move |state| {
//         routes::create_dao(state, dao_detail.clone()).await
//     })
//     .await;
//     result
// }
