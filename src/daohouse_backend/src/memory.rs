use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use std::cell::RefCell;

const POST_DATA: MemoryId = MemoryId::new(0);
const USER_DATA:MemoryId=MemoryId::new(1);
const DAO_DATA: MemoryId = MemoryId::new(2);
const ANALYTICS_DATA: MemoryId = MemoryId::new(3);

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

pub fn get_postdata_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(POST_DATA))
}

pub fn get_user_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(USER_DATA))
}

pub fn get_dao_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(DAO_DATA))
}

pub fn get_analytics_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(ANALYTICS_DATA))
}