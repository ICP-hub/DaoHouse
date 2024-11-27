# 
dfx stop
dfx start --clean --background

dfx generate

dfx identity new minter --storage-mode=plaintext  || true
dfx identity new reciever --storage-mode=plaintext  || true
dfx identity new testing --storage-mode=plaintext  || true



# dfx identity use default
dfx canister create dao_canister --network ic
dfx build dao_canister --network ic

MINTER=$(dfx --identity default identity get-principal)
DEFAULT=$(dfx --identity default identity get-principal)
RECIEVER=$(dfx --identity reciever identity get-principal)
TOKEN_SYMBOL=TOK
TOKEN_NAME="DAOTOKEN"
TRANSFER_FEE=1000
PRE_MINTED_TOKENS=100000000000
echo $RECIEVER


dfx deploy icrc1_ledger_canister --argument "(variant {Init = 
record {
     token_symbol = \"${TOKEN_SYMBOL}\";
     token_name = \"${TOKEN_NAME}\";
     minting_account = record { owner = principal \"${MINTER}\" };
     transfer_fee = ${TRANSFER_FEE};
     metadata = vec {};
     initial_balances = vec { record { record { owner = principal \"${DEFAULT}\"; }; ${PRE_MINTED_TOKENS}; }; };
     archive_options = record {
         num_blocks_to_archive = 100;
         trigger_threshold = 100;
         controller_id = principal \"${DEFAULT}\";
     };
     feature_flags = opt record {icrc2 = true;};
 }
})" --network ic


dfx deploy dao_canister --argument '(record{
    dao_name="Sample DAO";
    purpose="To manage community projects";
    daotype="Non-profit";
    link_of_document="https://example.com/charter.pdf";
    cool_down_period="7 days";
    members=vec{
        principal "aaaaa-aa";
    };
    tokenissuer="sample_token_issuer";
    linksandsocials=vec{
        "https://twitter.com/sampledao";
        "https://discord.gg/sampledao";
    };
    required_votes=100;
    image_id="1";
    members_permissions=vec{
    };

})' --network ic

dfx deploy daohouse_backend --argument "(record { payment_recipient = principal \"${RECIEVER}\"; })" --network ic
dfx deploy ic_asset_handler --network ic
./main_asset.sh
dfx deploy internet_identity --network ic
dfx deploy daohouse_frontend --network ic

