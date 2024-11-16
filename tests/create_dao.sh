#!/bin/bash

chmod 777 ./create_profile.sh
./create_profile.sh

# ASSET_HANDLER_ID=$(dfx canister id ic_asset_handler)
# echo "ASSET_HANDLER_ID: $ASSET_HANDLER_ID"
# dfx ledger fabricate-cycles --all

COUNT=1

for ((i = 1; i <= COUNT; i++)); do
  dao_test=$(dfx canister call daohouse_backend create_dao '(
    record {
      dao_name = "1";
      purpose = "test krne ke liye ke chota sa sentence";
      link_of_document = "https://example.com/charter.pdf";
      cool_down_period = 7;
      token_name = "DRAGONBALLZ";
      token_supply = 1000;
      token_symbol = "GOKU";
      members = vec{
        principal "xtbxv-f7q6j-ophog-cryki-6oaez-j7agl-i74rt-wnpbm-bywl2-62j32-vqe";
        principal "6ydm4-srext-xsaic-y3v2x-cticp-5n6pf-2meh7-j43r6-rghg7-pt5nd-bqe";
        principal "6iopj-he533-kf3kn-v5pds-ovr3y-h5cyc-3v7zy-455tb-sh3of-6yyyj-kqe";
      };
      all_dao_user = vec{
        principal "xtbxv-f7q6j-ophog-cryki-6oaez-j7agl-i74rt-wnpbm-bywl2-62j32-vqe";
        principal "6ydm4-srext-xsaic-y3v2x-cticp-5n6pf-2meh7-j43r6-rghg7-pt5nd-bqe";
        principal "6iopj-he533-kf3kn-v5pds-ovr3y-h5cyc-3v7zy-455tb-sh3of-6yyyj-kqe";
      };
      tokens_required_to_vote = 1;
      tokenissuer = "sample";
      linksandsocials = vec{
        "https://twitter.com/sampledao";
      };
    required_votes = 1;
      image_id = "1";
      image_content = vec {10};
      image_title = "sample.jpg";
      image_content_type = "image/jpg";
      members_permissions = vec{
        variant { AddMemberToDaoProposal };
        variant { AddMemberToGroupProposal };
        variant { RemoveMemberToDaoProposal };
        variant { RemoveMemberToGroupProposal };
        variant { ChangeDaoConfig };
        variant { ChangeDaoPolicy };
        variant { BountyRaised };
        variant { BountyDone };
        variant { Polls };
        variant { TokenTransfer };
        variant { GeneralPurpose };
        variant { MintNewTokens };
    };
    proposal_entry = vec {
        record {
            place_name = "Council";
            min_required_thredshold = 53;
        };
        record {
            place_name = "Example Group";
            min_required_thredshold = 94;
        };
    };
     dao_groups = vec {
        record {
            group_name = "Example Group";
            group_members = vec {
            principal "xtbxv-f7q6j-ophog-cryki-6oaez-j7agl-i74rt-wnpbm-bywl2-62j32-vqe";
            principal "6ydm4-srext-xsaic-y3v2x-cticp-5n6pf-2meh7-j43r6-rghg7-pt5nd-bqe";
            principal "6iopj-he533-kf3kn-v5pds-ovr3y-h5cyc-3v7zy-455tb-sh3of-6yyyj-kqe";
           };
            group_permissions = vec { 
            variant { AddMemberToGroupProposal };
            variant { Polls };
            variant { TokenTransfer };  
          };
            quorem = 65;
        };
    };
    ask_to_join_dao = true;
    }
  )')

  echo "$dao_test"
done
