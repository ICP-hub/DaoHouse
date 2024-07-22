// use std::collections::BTreeMap;

use std::borrow::{Borrow, BorrowMut};

use crate::routes::upload_image;
// <<<<<<< pratap
use crate::types::{ Comment, PostInfo, PostInput };
use crate::{
    with_state,
    Analytics,
    DaoDetails,
    GetAllPostsResponse,
    ImageData,
    Pagination,
    ReplyCommentData,
// =======
// use crate::types::{Comment, PostInfo, PostInput};
// use crate::{
//     with_state, Analytics, DaoDetails, GetAllPostsResponse, ImageData, Pagination, ReplyCommentData,
// >>>>>>> main
};
use candid::Principal;
use ic_cdk::api;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::{query, update};
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
// <<<<<<< pratap
use icrc_ledger_types::icrc2::transfer_from::{ TransferFromArgs, TransferFromError };
use sha2::{ Digest, Sha256 };
use crate::guards::*;
// =======
// use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};
// use sha2::{Digest, Sha256};
// // use uuid::Uuid;
// >>>>>>> main

#[update(guard = prevent_anonymous)]
async fn create_new_post(canister_id: String, post_details: PostInput) -> Result<String, String> {
    let principal_id = api::caller();
    // if principal_id == Principal::anonymous() {
    //     return Err("Anonymous principal not allowed to make calls.".to_string());
    // }

    // let uuids = raw_rand().await.unwrap().0;
    // let post_id = format!("{:x}", Sha256::digest(&uuids));
    let uuids = match raw_rand().await {
        Ok(uuids) => uuids.0,
        Err(_) => {
            return Err("Failed to generate UUID".to_string());
        }
    };
    let post_id = format!("{:x}", Sha256::digest(&uuids));

    // upload image
    let image_id: Result<String, String> = upload_image(
        canister_id,
        ImageData {
            content: post_details.image_content,
            name: post_details.image_title,
            content_type: post_details.image_content_type,
        },
    )
    .await;
    // let image_id = upload_image(canister_id, ImageData {
    //     content: post_details.image_content,
    //     name: post_details.image_title,
    //     content_type: post_details.image_content_type,
    // }).await;

    // let image_id = match image_id {
    //     Ok(id) => id,
    //     Err(er) => {
    //         ic_cdk::println!("error {}", er);
    //         return Err("Image upload failed".to_string());
    //     }
    // };
    let mut id = String::new();
    let image_create_res: bool = (match image_id {
        Ok(value) => {
            id = value;
            Ok(())
        }
        Err(er) => {
            ic_cdk::println!("error {}", er.to_string());
            Err(())
        }
    })
    .is_err();

    if image_create_res {
        return Err("Image upload failed".to_string());
    }

    // getting user profile picture

    let new_post = PostInfo {
        principal_id,
        post_id: post_id.clone(),
        username: post_details.username,
        //  post_title: post_details.post_title,
        post_description: post_details.post_description,
        post_img: id,
        // post_created_at: String::new(),
        post_created_at: ic_cdk::api::time(),
        like_count: 0,
        like_id_list: Vec::new(),
        comment_count: 0,
        comment_list: Vec::new(),
        user_image_id: post_details.user_image_id,
        is_liked: 0
    };

    let result = with_state(|state| {
        let mut analytics = state.analytics_content.borrow().get(&0).unwrap();
        analytics.post_count += 1;
        state.analytics_content.insert(0, analytics);
        state.post_detail.insert(post_id, new_post);

        match state.user_profile.get(&principal_id) {
            Some(mut val) => {
                val.post_count += 1;
                state.user_profile.insert(principal_id, val);
                Ok(())
            }
            None => {
                return Err(String::from("Failed to update post count "));
            }
        }
    });

    match result {
        Ok(_) => Ok("Post created successfully".to_string()),
        Err(e) => Err(e),
    }

    // Ok("Post created successfully".to_string())

    // async closures are not stable in rust (JUNE 24)
    // state.post_detail.insert(post_id, new_post);
    // with_state(|state| routes::create_new_post(state, post_id,postdetail.clone()))
}

#[query(guard = prevent_anonymous)]
fn get_all_posts(page_data: Pagination) -> GetAllPostsResponse {
    let mut all_posts = Vec::new();

    with_state(|state| {
        for (_k, v) in state.post_detail.iter() {
            // all_posts.push((k.clone(), v.clone()));
            all_posts.push(v.clone());
        }
    });

    let ending = all_posts.len();

    if ending == 0 {
        return GetAllPostsResponse {
            posts: all_posts,
            size: 0 as u32,
            // all_posts,
            // "0".to_string()
        };
    }

    let start = page_data.start as usize;
    let end = page_data.end as usize;

    if start < ending {
        let end = end.min(ending);
        return GetAllPostsResponse {
            posts: all_posts[start..end].to_vec(),
            size: ending as u32,
        };
        // all_posts[start..end].to_vec(), ending.to_string());
    }

    GetAllPostsResponse {
        posts: all_posts,
        size: ending as u32,
        // all_posts,
        // "0".to_string()

    }
    // all_posts
    // (Vec::new(), 0.to_string())
}

#[update(guard = prevent_anonymous)]
async fn like_post(post_id: String) -> Result<String, String> {
    let getpost = with_state(|state| state.post_detail.get(&post_id).unwrap().clone());

    let principal_id = api::caller();

    if getpost.like_id_list.contains(&principal_id) {
        return Err("You have already liked this post".to_string());
    }

    let updated_like_count = getpost.like_count + 1;
    let mut updated_like_id_list = getpost.like_id_list.clone();
    updated_like_id_list.push(principal_id);

    let new_post = PostInfo {
        principal_id: getpost.principal_id,
        post_id: getpost.post_id.clone(),
        username: getpost.username.clone(),
        //    post_title: getpost.post_title.clone(),
        post_description: getpost.post_description.clone(),
        post_img: getpost.post_img.clone(),
        post_created_at: getpost.post_created_at.clone(),
        like_count: updated_like_count,
        like_id_list: updated_like_id_list,
        comment_count: getpost.comment_count.clone(),
        comment_list: getpost.comment_list.clone(),
        user_image_id: getpost.user_image_id.clone(),
        is_liked: 1,
    };
    with_state(|state| state.post_detail.insert(new_post.post_id.clone(), new_post));

    return Ok("Post liked successfully".to_string());
}

#[query(guard = prevent_anonymous)]
async fn get_post_byid(id: String) -> Result<PostInfo, String> {
    match with_state(|state| state.post_detail.get(&id)) {
        Some(post) => Ok(post),
        None => Err("Post not found".to_string()),
    }
}

#[update(guard = prevent_anonymous)]
async fn comment_post(post_id: String, comment: String) -> Result<String, String> {
    let getpost = match with_state(|state| state.post_detail.get(&post_id).clone()) {
        Some(post) => post,
        None => {
            return Err("Post not found.".to_string());
        }
    };

    let mut updated_list = getpost.comment_list.clone();

    // let uuids = raw_rand().await.unwrap().0;
    // let unique_commend_id = format!("{:x}", Sha256::digest(&uuids));

    let uuids = match raw_rand().await {
        Ok(uuids) => uuids.0,
        Err(_) => {
            return Err("Failed to generate UUID".to_string());
        }
    };
    let unique_commend_id = format!("{:x}", Sha256::digest(&uuids));

    let new_comment = Comment {
        author_principal: api::caller(),
        comment_text: comment,
        replies: Vec::new(),
        comment_id: Some(unique_commend_id), // comment_id: Some(Uuid::new_v4().to_string())
                                             // comment_id: Some(String::from("value")),
    };

    updated_list.push(new_comment);
    // updated_list.push(comment);

    let new_post = PostInfo {
        principal_id: getpost.principal_id,
        post_id: getpost.post_id.clone(),
        username: getpost.username,
        //   post_title: getpost.post_title.clone(),
        post_description: getpost.post_description.clone(),
        post_img: getpost.post_img.clone(),
        post_created_at: getpost.post_created_at.clone(),
        like_count: getpost.like_count.clone(),
        like_id_list: getpost.like_id_list.clone(),
        comment_count: getpost.comment_count + 1,
        comment_list: updated_list,
        user_image_id: getpost.user_image_id.clone(),
        is_liked: getpost.is_liked
    };
    with_state(|state| state.post_detail.insert(new_post.post_id.clone(), new_post));

    return Ok("comment successfully".to_string());
}

// reply comment
#[update(guard = prevent_anonymous)]
fn reply_comment(comment_data: ReplyCommentData) -> Result<String, String> {
// <<<<<<< pratap
    let post = with_state(|state| state.post_detail.get(&comment_data.post_id).clone()).expect(
        "Post not found"
    );
// =======
//     // let principal_id = api::caller();
//     if api::caller() == Principal::anonymous() {
//         return Err("Anonymous users not allowed".to_string());
//     }

//     let post = with_state(|state| state.post_detail.get(&comment_data.post_id).clone())
//         .expect("Post not found");
// >>>>>>> main

    let mut updated_comment_list = post.comment_list.clone();

    // let mut comment_found = false;
    for com in updated_comment_list.iter_mut() {
        if com.comment_id == Some(comment_data.comment_id.clone()) {
            com.replies.push(comment_data.comment.clone());
            break;
        }
    }

    // if !comment_found {
    //     return Err("Comment not found".to_string());
    // }

    let updated_post = PostInfo {
        comment_count: post.comment_count + 1,
        comment_list: updated_comment_list,
        ..post
    };

    with_state(|state| {
        state
            .post_detail
            .insert(updated_post.post_id.clone(), updated_post)
    });

    Ok("commented on post".to_string())
}

#[query]
fn get_latest_post(page_data: Pagination) -> GetAllPostsResponse {
    let mut posts = Vec::new();

    with_state(|state| {
        for (_k, v) in state.post_detail.iter() {
            posts.push(v.clone());
        }
    });

    let length = posts.len();
    if length == 0 {
        return GetAllPostsResponse {
            posts: posts,
            size: 0 as u32,
        };
    }

    posts.sort_by(|a, b| b.post_created_at.cmp(&a.post_created_at));

    let start = page_data.start as usize;
    let end = page_data.end as usize;

    if start < length {
        let end = end.min(length);
        return GetAllPostsResponse {
            posts: posts[start..end].to_vec(),
            size: length as u32,
        };
    }

    GetAllPostsResponse {
        posts: posts,
        size: length as u32,
    }
}

#[query(guard = prevent_anonymous)]
fn get_my_post(page_data: Pagination) -> Result<GetAllPostsResponse, String> {
    let principal_id = api::caller();

    let mut posts: Vec<PostInfo> = Vec::new();

    with_state(|state| {
        for v in state.post_detail.iter() {
            if v.1.principal_id == principal_id {
                posts.push(v.1.clone());
            }
        }
    });

    let ending = posts.len();
    if ending == 0 {
        return Ok(GetAllPostsResponse {
            posts: posts,
            size: 0 as u32,
            // all_posts,
            // "0".to_string()
        });
    }

    let start = page_data.start as usize;
    let end = page_data.end as usize;

    if start < ending {
        let end = end.min(ending);
        return Ok(GetAllPostsResponse {
            posts: posts[start..end].to_vec(),
            size: ending as u32,
        });
        // all_posts[start..end].to_vec(), ending.to_string());
    }

    Ok(GetAllPostsResponse {
        posts: posts,
        size: ending as u32,
        // all_posts,
        // "0".to_string()
    })

    // let start = page_data.start as usize;
    // let end = page_data.end as usize;

    // if start < ending {
    //     let end = end.min(ending);
    //     return Ok(posts[start..end].to_vec());
    // }
    // Ok(Vec::new())
    // Ok(posts)
}

#[query]
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

// get canister cycles
#[query]
fn get_cycles() -> u64 {
    api::canister_balance()
}

// // get caller
#[query]
fn get_caller() -> Principal {
    api::caller()
}

// ledger handlers
async fn transfer(tokens: u64, user_principal: Principal) -> Result<BlockIndex, String> {
    let payment_recipient = with_state(|state| state.borrow_mut().get_payment_recipient());

    ic_cdk::println!("id is {}", payment_recipient.to_string());
    // let payment_recipient = STATE.with(|state| {
    //     let state = state.borrow();
    //     state.get_payment_recipient()
    // });

    ic_cdk::println!(
        "Transferring {} tokens to principal {}",
        tokens,
        payment_recipient
    );
    let transfer_args = TransferFromArgs {
        amount: tokens.into(),
        to: Account {
            owner: payment_recipient,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: user_principal,
            subaccount: None,
        },
    };

    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai")
            .expect("Could not decode the principal."),
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    .0
    .map_err(|e| format!("ledger transfer error {:?}", e))
}

// make payment
#[update(guard = prevent_anonymous)]
async fn make_payment(tokens: u64, user: Principal) -> String {
    // add check for admin
    let response = transfer(tokens, user).await;
    ic_cdk::println!("response is {:?}", response);
    // response
    format!("response is {:?}", response)
}

// increase proposals count
#[update]
fn update_proposal_count() -> String {
    with_state(|state| match state.analytics_content.borrow().get(&0) {
        Some(mut val) => {
            val.proposals_count += 1;
            state.analytics_content.insert(0, val);
        }
        None => {
            "Failed to update count".to_string();
        }
    });
    "success".to_string()
}
