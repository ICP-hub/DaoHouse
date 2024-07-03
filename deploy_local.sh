
dfx generate
dfx build
dfx deploy dao_canister --argument '(record{
    dao_name="Sample DAO";
    purpose="To manage community projects";
    daotype="Non-profit";
    link_of_document="https://example.com/charter.pdf";
    cool_down_period="7 days";
    members=vec{
        "aaaaa-aa";
    };
    tokenissuer="sample_token_issuer";
    linksandsocials=vec{
        "https://twitter.com/sampledao";
        "https://discord.gg/sampledao";
    };
    required_votes=100;
})' 



dfx deploy daohouse_backend 
# dfx deploy internet_identity 
# dfx deploy daohouse_frontend 
dfx deploy ic_asset_handler 
# dfx generate