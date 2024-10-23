DAOHOUSE_CANISTER_ID=$(dfx canister id daohouse_backend)

test12=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai proposal_to_bounty_done "(
  record {
    description = \"Bhanu again testing post description.\";
    tokens = 100 : nat64;
    proposal_entry = \"Council\";
    daohouse_canister_id = principal \"$DAOHOUSE_CANISTER_ID\";
    associated_proposal_id = \"2e9abc6d5bddc81ce99755eb9e4b281097bdddcf7429d482a5e196255ba4e61e\";
  }
)")

echo $test12
