
test10=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai proposal_to_remove_member_to_group '(
  record {
    group_name = "Example Group";
    action_member = principal "rmehg-adw5r-6trpq-epk4r-tyl4c-dd2u4-erbw4-kcjzr-rrjpf-dfvi2-oae";
    description = "bro just tesing yar";
  }
)')
 echo "$test10"
