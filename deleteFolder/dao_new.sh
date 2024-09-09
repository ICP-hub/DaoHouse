
ASSET_HANDLER_ID=$(dfx canister id ic_asset_handler)
echo "ASSET_HANDLER_ID: $ASSET_HANDLER_ID"

COUNT=1

for ((i = 1; i <= COUNT; i++)); do
  dao_test=$(dfx canister call daohouse_backend dao_create '(
    "'$ASSET_HANDLER_ID'", 
    record {
      dao_name = " 1111111bottle dao";
      purpose = "test krne ke liye ke chota sa sentence";
      daotype = "Non-profit";
      link_of_document = "https://example.com/charter.pdf";
      cool_down_period = "7 days";
      members = vec{
        principal "aaaaa-aa";
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
        "mai hi permission hai";
    };
      
    }
  )')

  echo "$dao_test"
done
