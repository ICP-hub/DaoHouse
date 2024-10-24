DAOHOUSE_CANISTER_ID=$(dfx canister id daohouse_backend)

test12=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai proposal_to_bounty_done "(
  record {
    description = \"Bhanu again testing post description.\";
    tokens = 100 : nat64;
    proposal_entry = \"Council\";
    daohouse_canister_id = principal \"$DAOHOUSE_CANISTER_ID\";
    associated_proposal_id = \"4eae23c7e87e2234b92c7bfc4fa8c2d008689cc796246bb17fb34bec135d9f96\";
  }
)")

echo $test12
