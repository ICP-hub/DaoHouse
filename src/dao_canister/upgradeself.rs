use borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, Serialize, Hash)]
pub struct AccountId(String);

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
pub struct ActionCall {
    method_name: String,
    args: Vec<u8>,
    deposit: u128,
    gas: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
pub enum ProposalKind {
    FunctionCall {
        receiver_id: AccountId,
        actions: Vec<ActionCall>,
    },
}

fn create_proposal(context: &mut VMContextBuilder, contract: &mut Contract) -> u64 {
    contract.add_proposal(ProposalInput {
        description: "test".to_string(),
        kind: ProposalKind::FunctionCall {
            receiver_id: accounts(2).into(),
            actions: vec![
                ActionCall {
                    method_name: "method_name".to_string(),
                    args: vec![], 
                    deposit: to_yocto("1"),
                    gas: 300_000_000_000_000,
                },
            ],
        },
    })
}
