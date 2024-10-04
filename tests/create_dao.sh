#!/bin/bash

chmod 777 ./create_profile.sh
./create_profile.sh

# ASSET_HANDLER_ID=$(dfx canister id ic_asset_handler)
# echo "ASSET_HANDLER_ID: $ASSET_HANDLER_ID"

COUNT=1

for ((i = 1; i <= COUNT; i++)); do
  dao_test=$(dfx canister call daohouse_backend create_dao '(
    record {
      dao_name = "first dao";
      purpose = "test krne ke liye ke chota sa sentence";
      daotype = "Non-profit";
      link_of_document = "https://example.com/charter.pdf";
      cool_down_period = 7;
      token_name = "DRAGONBALLZ";
      token_supply = 1000;
      token_symbol = "GOKU";
      members = vec{
        principal "xtbxv-f7q6j-ophog-cryki-6oaez-j7agl-i74rt-wnpbm-bywl2-62j32-vqe";
        principal "6ydm4-srext-xsaic-y3v2x-cticp-5n6pf-2meh7-j43r6-rghg7-pt5nd-bqe";
        principal "yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae";
      };
      tokens_required_to_vote = 1;
      tokenissuer = "sample";
      linksandsocials = vec{
        "https://twitter.com/sampledao";
      };
    required_votes = 3;
      image_id = "1";
      image_content = vec {10};
      image_title = "sample.jpg";
      image_content_type = "image/jpg";
      members_permissions = vec{
        "permission";
    };
    proposal_entiry = vec {
        record {
            place_name = "Council";
            min_required_thredshold = 53;
        };
        record {
            place_name = "Example Group";
            min_required_thredshold = 94;
        };
        record {
            place_name = "Example Group2";
            min_required_thredshold = 56;
        };
        record {
            place_name = "Example Group3";
            min_required_thredshold = 65;
        };
    };
     dao_groups = vec {
        record {
            group_name = "Example Group";
            group_members = vec {
            principal "6ydm4-srext-xsaic-y3v2x-cticp-5n6pf-2meh7-j43r6-rghg7-pt5nd-bqe";
            principal "rmehg-adw5r-6trpq-epk4r-tyl4c-dd2u4-erbw4-kcjzr-rrjpf-dfvi2-oae";
            principal "yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae";  
           };
            group_permissions = vec { "example_permission" };
            quorem = 65;
        };
        record {
            group_name = "Example Group2";
            group_members = vec {
            principal "6ydm4-srext-xsaic-y3v2x-cticp-5n6pf-2meh7-j43r6-rghg7-pt5nd-bqe";
            principal "6ydm4-srext-xsaic-y3v2x-cticp-5n6pf-2meh7-j43r6-rghg7-pt5nd-bqe";
            principal "ui2dz-muwb7-dhwzj-545cc-ets5d-wc3gr-hi5qi-zavzz-arybg-fsh6r-eae";  
           };
            group_permissions = vec { "example_permission" };
            quorem = 65;
        };
        record {
            group_name = "Example Group3";
            group_members = vec { principal "aaaaa-aa" };
            group_permissions = vec { "example_permission" };
            quorem = 65;
        }
    };
      
    }
  )')

  echo "$dao_test"
done
