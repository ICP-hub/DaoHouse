test10=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai proposal_to_add_member_to_group '(
  record {
    group_name = "Example Group";
    new_member = principal "ui2dz-muwb7-dhwzj-545cc-ets5d-wc3gr-hi5qi-zavzz-arybg-fsh6r-eae";
    description = "we want add an member to group";
  }
)')
 echo "$test10"