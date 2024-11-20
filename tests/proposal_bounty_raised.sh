test11=$(dfx canister call b77ix-eeaaa-aaaaa-qaada-cai proposal_to_bounty_raised "(
  record {
    description = \"Anish want to create a website for bounty raised proposal testing.\";
    bounty_task = \"creating testing website\";
    proposal_entry = \"Council\";
    tokens = 100;
  }
)")

echo $test11
