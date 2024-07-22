#!/bin/bash

ASSET_HANDLER_ID=$(dfx canister id ic_asset_handler)
echo "ASSET_HANDLER_ID: $ASSET_HANDLER_ID"



 TEST=$(dfx canister call daohouse_backend update_profile "(
    \"$ASSET_HANDLER_ID\",
    record {
      email_id = \"pratapsinghbhanu@gmail.com\";
      profile_img = \"abc\";
      username = \"bhanupra123\";
      description = \"This is a sample profile description.\";
      contact_number = \"123-456-7890\";
      twitter_id = \"@bhanupra_twitter\";
      telegram = \"@bhanupra_telegram\";
      website = \"https://bhanuprawebsite.com\";
      tag_defines = vec {\"tag1\"};
      image_content = vec {200};
      image_title = \"bhanuprofile.png\";
      image_content_type = \"image/png\";
      user_image_id = \"1\";
    }
  )")


echo $TEST