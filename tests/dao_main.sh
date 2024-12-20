#!/bin/bash

dfx canister call daohouse_backend create_profile --network ic

ASSET_HANDLER_ID=$(dfx canister id ic_asset_handler --network ic)
echo "ASSET_HANDLER_ID: $ASSET_HANDLER_ID"

COUNT=1

for ((i = 1; i <= COUNT; i++)); do
  dao_test=$(dfx canister call daohouse_backend create_dao '(
    "'$ASSET_HANDLER_ID'", 
    record {
      dao_name = "testing out";
      purpose = "test krne ke liye ke chota sa sentence";
      daotype = "Non-profit";
      link_of_document = "https://example.com/charter.pdf";
      cool_down_period = 7;
      token_name = "DRAGONBALLZ";
      total_tokens = 1000;
      token_symbol = "GOKU";
      members = vec{
        principal "m2zqz-pr5r2-ozayk-w5trf-mt6mw-7vuys-mitrw-4qdpb-dm5p7-77ey6-fae";
        principal "rmehg-adw5r-6trpq-epk4r-tyl4c-dd2u4-erbw4-kcjzr-rrjpf-dfvi2-oae";
        principal "yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae";
      };
      tokenissuer = "sample";
      linksandsocials = vec{
        "https://twitter.com/sampledao";
      };
      required_votes = 100;
      image_id = "1";
      image_content = vec {10};
      image_title = "sample.jpg";
      image_content_type = "image/jpg";
        members_permissions=vec{
        "permission";
    };
     dao_groups = vec {
        record {
            group_name = "Example Group";
            group_members = vec { principal "aaaaa-aa" };
            group_permissions = vec { "example_permission" };
        };
        record {
            group_name = "Example Group2";
            group_members = vec { principal "aaaaa-aa" };
            group_permissions = vec { "example_permission" };
        };
        record {
            group_name = "Example Group3";
            group_members = vec { principal "aaaaa-aa" };
            group_permissions = vec { "example_permission" };
        }
    };
      
    }
  )' --network ic ) 

  echo "$dao_test"
done
