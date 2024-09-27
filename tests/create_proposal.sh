test10=$(dfx canister call by6od-j4aaa-aaaaa-qaadq-cai proposal_to_add_member_to_group '(
  record {
    group_name = "Example Group";
    new_member = principal "aaaaa-aa";
    description = "we want add an member to ddddddd";
  }
)')
 echo "$test10"