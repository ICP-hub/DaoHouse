COUNT=1

for ((i = 1; i <= COUNT; i++)); do 
test10=$(dfx canister call by6od-j4aaa-aaaaa-qaadq-cai proposal_to_remove_member_to_dao '(
  record {
    group_name = "Example Group";
    action_member = principal "6j7a7-sm242-5xr4h-aitgw-33qxw-ajp2z-ijh7a-onf2i-ack3m-a2or6-eqe";
    description = "10";
    proposal_entry = "Council";
  }
)')
 echo "$test10"

done