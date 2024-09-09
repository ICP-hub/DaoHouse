# # CREATING USER
dfx canister call daohouse_backend create_profile
# ASSET_HANDLER_ID=$(dfx canister id ic_asset_handler)

# # CREATING DAO
#   dao_test=$(dfx canister call daohouse_backend create_dao '(
#     "'$ASSET_HANDLER_ID'", 
#     record {
#       dao_name = " Bunnu dao";
#       purpose = "test krne ke liye ke chota sa sentence";
#       daotype = "Non-profit";
#       link_of_document = "https://example.com/charter.pdf";
#       cool_down_period = "7 days";
#       members = vec{
#         principal "aaaaa-aa";
#       };
#       tokenissuer = "sample";
#       linksandsocials = vec{
#         "https://twitter.com/sampledao";
#       };
#       required_votes = 100;
#       image_id = "1";
#       image_content = vec {10};
#       image_title = "sample.jpg";
#       image_content_type = "image/jpg";
#         members_permissions=vec{
#         "mai hi permission hai";
#     };
      
#     }
#   )')

#   echo "$dao_test"

#   # LISTING DAO
# dfx canister call daohouse_backend get_all_dao '(
#   record {
#     end = 10;
#     start = 0;
#   }
# )'
  

  DAOHOUSE_CANISTER_ID=$(dfx canister id daohouse_backend)

test10=$(dfx canister call dao_canister create_proposal '(
   "'$DAOHOUSE_CANISTER_ID'",
  record {
    proposal_title = "New Community Park";
    proposal_description = "Proposal for the construction of a new community park in the downtown area.";
    required_votes = 200;
    proposal_type = variant {AddMemberProposal};
  }
)')

echo $test10

test10=$(dfx canister call bw4dl-smaaa-aaaaa-qaacq-cai create_proposal '(
   "'$DAOHOUSE_CANISTER_ID'",
  record {
    proposal_title = "New Community Park";
    proposal_description = "Proposal for the construction of a new community park in the downtown area.";
    required_votes = 200;
    proposal_type = variant {AddMemberProposal};
  }
)')

dfx canister call dao_canister get_all_proposals