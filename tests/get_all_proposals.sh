tests11=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai get_all_proposals '(
  record {
    end = 5;
    start = 0;
  }
)')
 echo "$tests11"