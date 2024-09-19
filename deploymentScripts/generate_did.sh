cargo build --release --target wasm32-unknown-unknown --package dao_canister

candid-extractor target/wasm32-unknown-unknown/release/dao_canister.wasm >src/dao_canister/dao_canister.did

cargo build --release --target wasm32-unknown-unknown --package daohouse_backend

candid-extractor target/wasm32-unknown-unknown/release/daohouse_backend.wasm >src/daohouse_backend/daohouse_backend.did

cargo build --release --target wasm32-unknown-unknown --package ic_asset_handler

candid-extractor target/wasm32-unknown-unknown/release/ic_asset_handler.wasm >src/ic_asset_handler/ic_asset_handler.did

