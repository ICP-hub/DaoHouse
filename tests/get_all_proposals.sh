tests11=$(dfx canister call by6od-j4aaa-aaaaa-qaadq-cai get_all_proposals '(
  record {
    end = 5;
    start = 0;
  }
)')
 echo "$tests11"