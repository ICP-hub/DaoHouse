use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use std::cell::RefCell;

const POST_DATA: MemoryId = MemoryId::new(0);


const USER_DATA:MemoryId=MemoryId::new(1);

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