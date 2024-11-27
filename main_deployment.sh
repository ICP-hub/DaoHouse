set -e

# CREATING IDENTITES
dfx identity new minter --storage-mode=plaintext || true
dfx identity new reciever --storage-mode=plaintext || true
dfx identity new testing --storage-mode=plaintext || true
dfx identity new Bhanu --storage-mode=plaintext || true

MINTER=$(dfx --identity default identity get-principal)
DEFAULT=$(dfx --identity default identity get-principal)
RECIEVER=$(dfx --identity reciever identity get-principal)
PRO=$(dfx --identity minter identity get-principal) # rmehg-adw5r-6trpq-epk4r-tyl4c-dd2u4-erbw4-kcjzr-rrjpf-dfvi2-oae
BHANU=$(dfx --identity Bhanu identity get-principal)  #
TOKEN_SYMBOL=TOK
TOKEN_NAME="DAOTOKEN"
TRANSFER_FEE=1000
PRE_MINTED_TOKENS=100000000000
echo $RECIEVER
DIFFERENT=20000000


# chmod 777 ./generate_did.sh
# ./generate_did.sh

# dfx deploy icrc1_ledger_canister --argument "(variant {Init = 
# record {
#     token_symbol = \"${TOKEN_SYMBOL}\";
#     token_name = \"${TOKEN_NAME}\";
#     minting_account = record { owner = principal \"${MINTER}\" };
#     transfer_fee = ${TRANSFER_FEE};
#     metadata = vec {}; 
#     initial_balances = vec {
#         record { record { owner = principal \"${RECIEVER}\" }; ${DIFFERENT} }
#     };
#     archive_options = record {
#         num_blocks_to_archive = 100;
#         trigger_threshold = 100;
#         controller_id = principal \"${DEFAULT}\";
#     };
#     feature_flags = opt record { icrc2 = true; };
# }
# })" --network ic


# dfx deploy ic_asset_handler --network ic
dfx deploy daohouse_backend --argument "(record { payment_recipient = principal \"${RECIEVER}\"; })" --network ic


dfx deploy dao_canister --argument '(record {
    dao_name = "Sample DAO";
    purpose = "To manage community projects";
    daotype = "Non-profit";
    link_of_document = "https://example.com/charter.pdf";
    cool_down_period = 7;
    members = vec {
        principal "aaaaa-aa";
    };
    tokenissuer = "sample_token_issuer";
    linksandsocials = vec {
        "https://twitter.com/sampledao";
        "https://discord.gg/sampledao";
    };
    required_votes = 100;
    image_id = "1";
    tokens_required_to_vote = 1;
    members_permissions = vec {
        "mai hi permission hai";
    };
    dao_groups = vec {
        record {
            group_name = "Example Group";
            group_members = vec { principal "yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae" };
            group_permissions = vec { "example_permission" };
            quorem = 75;
        };
        record {
            group_name = "Example Group2";
            group_members = vec { principal "yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae" };
            group_permissions = vec { "example_permission" };
            quorem = 85;

        };
        record {
            group_name = "Example Group3";
            group_members = vec { principal "aaaaa-aa" };
            group_permissions = vec { "example_permission" };
            quorem = 65;

        }
    };
})'

 --network ic

# # ./assets_upload.sh
# dfx deploy daohouse_frontend --network ic
# # dfx deploy internet_identity --network ic

dfx deploy --network ic