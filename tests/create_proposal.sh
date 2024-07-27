DAOHOUSE_CANISTER_ID=$(dfx canister id daohouse_backend)

test10=$(dfx canister call dao_canister create_proposal '(
   "'$DAOHOUSE_CANISTER_ID'",
  record {
    proposal_title = "New Community Park";
    proposal_description = "Proposal for the construction of a new community park in the downtown area.";
    required_votes = 200;
  }
)')

echo $test10
