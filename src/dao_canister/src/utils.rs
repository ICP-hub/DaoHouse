// DAO permissions
pub const PERMISSION_ADD_MEMBER_TO_GROUP: &str = "add_member";
pub const PERMISSION_CHANGE_DAO_CONFIG: &str = "ChangeDAOConfig";

// Essential members 
pub const COUNCIL_GROUP_NAME: &str = "council";

// General responses / errors / warninigs
pub const TITLE_ADD_MEMBER: &str = "Add new memeber";
pub const REQUEST_ADD_MEMBER: &str = "Proposal successfully created !.";
pub const NOTFOUND_GROUP: &str = "No groups found with the given name";
pub const WARNING_ALREADY_FOLLOW_DAO: &str = "You are already following this DAO";
pub const SUCCESS_FOLLOW_DAO: &str = "Successfully followed !";
pub const REQUEST_JOIN_DAO: &str = "Request to join DAO";
pub const WARNING_NOT_ALLOWED: &str = "Unauthorized access.";
pub const WARNING_PROPOSAL_EXISTS: &str = "Proposal already exists with same request.";
pub const WARNING_NOT_IN_GROUP: &str = "You are not part of the group";
pub const WARNING_NO_PROPOSAL: &str = "No proposal matches your requirements";
pub const WARNING_ALREADY_VOTED: &str = "You have already voted for the proposal.";
pub const WARNING_DAO_MEMBER_ONLY: &str = "Only members of DAO can perform this action.";
pub const WARNING_ANONYMOUS_CALL: &str = "Anonymous principal not allowed !";
pub const WARNING_INTER_CANISTER: &str = "Intercanister call failed";
pub const WARNING_DONT_FOLLOW: &str = "You don't follow";
pub const SUCCESS_DAO_UPDATED: &str = "DAO successfully updated";
pub const WARNING_FAILED_BALANCE: &str = "Failed to fetch balance if particular account";
pub const WARNING_LESS_BALANCE: &str = "Available balance is less then required";
pub const WARNING_FAILED_TRANSFER: &str = "Failed to transfer tokens";
pub const SUCCESS_VOTED_WITH: &str = "Successfully voted in favour of Proposal.";
pub const SUCCESS_VOTED_AGAINST: &str = "Successfully voted against the proposal.";
pub const SUCCESS_COMMENT: &str = "Successfully commented";