use candid::{encode_one, Principal};
use ic_cdk::api::{self};

use crate::{
    CanisterInstallMode, CanisterSettings, CreateCanisterArgument, InstallCodeArgument, LedgerArg,
};

use super::canister_factory::{
    create_new_canister, deposit_cycles_in_canister, install_code_in_canister,
};

pub async fn create_ledger_canister(ledger_args: LedgerArg) -> Result<Principal, String> {
    // add dao canister id as controller
    // add factory canister id as controller

    let ledger_args_bytes: Vec<u8> = encode_one(ledger_args).map_err(|er| er.to_string())?;

    let controllers: Vec<Principal> = vec![api::caller(), ic_cdk::api::id()];

    let controller_settings = CanisterSettings {
        controllers: Some(controllers),
        ..Default::default()
    };

    let arg = CreateCanisterArgument {
        settings: Some(controller_settings),
    };

    let (canister_id,) = match create_new_canister(arg).await {
        Ok(id) => id,
        Err((_, err_string)) => {
            return Err(format!(
                "{} {}",
                crate::utils::CREATE_CANISTER_FAIL,
                err_string
            ));
        }
    };

    let _add_cycles = deposit_cycles_in_canister(canister_id, 150_000_000_000)
        .await
        .unwrap();

    let wasm_module: Vec<u8> = include_bytes!(
        "../../../../.dfx/local/canisters/icrc1_ledger_canister/icrc1_ledger_canister.wasm.gz"
    )
    .to_vec();

    // let wasm_module: Vec<u8> =
    //     include_bytes!("../../../wasm_modules/icrc1_ledger_canister.wasm").to_vec();

    let canister_id_principal = canister_id.canister_id;

    let arg1 = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id_principal,
        // wasm_module: vec![],
        wasm_module: wasm_module.clone(),
        arg: ledger_args_bytes,
    };

    ic_cdk::println!("next is installcode");

    install_code_in_canister(arg1, wasm_module).await.unwrap();

    //  let wasm_module_sample: Vec<u8> =
    //     include_bytes!("../../../../.dfx/local/canisters/icrc1_ledger_canister/icrc1_ledger_canister.wasm").to_vec();

    // CANISTER BNA BRO
    // let (canister_id,) = match create_new_canister(CreateCanisterArgument {
    //     settings: Some(controller_settings),
    // })
    // .await
    // {
    //     Ok(id) => id,
    //     Err((_, err_str)) => {
    //         return Err(err_str)
    //     }
    // };

    // Ok(format!("Ledger created, id: {}", canister_id_principal))
    Ok(canister_id_principal)
    // Ok(canister_id_principal.tos)
}

// get recipient

// get canister details

// get user balance
