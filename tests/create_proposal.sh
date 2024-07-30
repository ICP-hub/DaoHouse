DAOHOUSE_CANISTER_ID=$(dfx canister id daohouse_backend)

test10=$(dfx canister call by6od-j4aaa-aaaaa-qaadq-cai create_proposal '(
   "'$DAOHOUSE_CANISTER_ID'",
  record {
    proposal_title = "New  Park";
    proposal_description = "Proposal for the construction of a new community park in the downtown area.";
    required_votes = 200;
    proposal_type = variant {AddMemberProposal};
  }
)')

# echo $test10

# ./refresh_proposals.sh

dfx canister call by6od-j4aaa-aaaaa-qaadq-cai get_all_proposals

# b5d01f898f6a7d75397763d901b5a54597b3bd3f1276d0b5f3cc0299ab28fc48

# dfx canister call bw4dl-smaaa-aaaaa-qaacq-cai refresh_proposals '("446efeb6e23a33e71309471d0900e1a2751c6aface26e68d87fee68d7c33a861")' 