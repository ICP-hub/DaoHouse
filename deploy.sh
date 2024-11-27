RECIEVER=$(dfx --identity reciever identity get-principal)

dfx canister create dao_canister --network ic
dfx build dao_canister --network ic

chmod 777 ./generate_did.sh
./generate_did.sh

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
        "mai hi permission hai";
    };

})' --network ic

dfx deploy daohouse_backend --argument "(record { payment_recipient = principal \"${RECIEVER}\"; })" --network ic
dfx deploy daohouse_frontend --network ic
