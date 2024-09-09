// check balance
// transfer funds

use candid::{Nat, Principal};
use ic_cdk::update;
use icrc_ledger_types::{
    icrc1::{account::Account, transfer::BlockIndex},
    icrc2::transfer_from::{TransferFromArgs, TransferFromError},
};

use crate::{with_state, TokenTransferArgs};

use super::call_inter_canister;

// TODO REMOVE THIS UPDATE FROM HERE (INTERNAL FUNCTION)
#[update]
// to Transfer custom tokens
pub async fn icrc_transfer(args: TokenTransferArgs) -> Result<BlockIndex, String> {
    let ledger_id = with_state(|state| state.dao.token_ledger_id.id);

    let transfer_args = TransferFromArgs {
        amount: args.tokens.into(),
        to: Account {
            owner: args.to,
            subaccount: None,
        },
        fee: None,
        memo: None,
        created_at_time: None,
        spender_subaccount: None,
        from: Account {
            owner: args.from,
            subaccount: None,
        },
    };

    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        ledger_id,
        "icrc2_transfer_from",
        (transfer_args,),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    .0
    .map_err(|e| format!("ledger transfer error {:?}", e))
}

// to check balance
// #[update]
pub async fn icrc_get_balance(id: Principal) -> Result<Nat, String> {
    let ledger_canister = with_state(|state| state.dao.token_ledger_id.id);

    call_inter_canister::<Account, Nat>(
        "icrc1_balance_of",
        Account {
            owner: id,
            subaccount: None,
        },
        ledger_canister,
    )
    .await
}
