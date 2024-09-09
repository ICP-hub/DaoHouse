use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use std::cell::RefCell;

const POST_DATA: MemoryId = MemoryId::new(0);
// const POOL_DATA: MemoryId = MemoryId::new(1);
const GROUP_MEMORY: MemoryId = MemoryId::new(1);
const PROPOSAL_DATA: MemoryId = MemoryId::new(2);

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

pub fn get_postdata_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(POST_DATA))
}
// pub fn get_pool_data_memory() -> Memory {
//     MEMORY_MANAGER.with(|m| m.borrow().get(POOL_DATA))
// }

pub fn get_group_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(GROUP_MEMORY))
}

pub fn get_proposal_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(PROPOSAL_DATA))
}
