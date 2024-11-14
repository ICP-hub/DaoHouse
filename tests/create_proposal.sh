COUNT=1000

for ((i = 1; i <= COUNT; i++)); do 
test10=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai proposal_to_remove_member_to_dao '(
  record {
    group_name = "Example Group";
    action_member = principal "eylnw-gnl2t-nit3s-jnkej-425fc-xmlz2-5xjdc-xbkjb-x5fsp-gn3eb-gae";
    description = "we want add a member to Example Group";
    proposal_entry = "Council";
  }
)')
 echo "$test10"

done