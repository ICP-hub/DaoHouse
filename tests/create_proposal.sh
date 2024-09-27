test10=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai proposal_to_remove_member_to_group '(
  record {
    group_name = "Example Group";
    action_member = principal "aaaaa-aa";
    description = "we want add a member to Example Group";
  }
)')
 echo "$test10"