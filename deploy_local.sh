set -e
# dfx generate

# dfx build

dfx identity new minter --disable-encryption || true
dfx identity new reciever --disable-encryption || true
dfx identity new testing --disable-encryption || true

dfx identity use default

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
})"


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


})' 


dfx deploy daohouse_backend --argument "(record { payment_recipient = principal \"${RECIEVER}\"; })"
dfx deploy internet_identity 
dfx deploy daohouse_frontend 
dfx deploy ic_asset_handler 
# dfx generate