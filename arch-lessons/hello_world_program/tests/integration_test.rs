use arch_program::{
    account::AccountInfo,
    pubkey::Pubkey,
};
use hello_world_program::process_instruction;

#[test]
fn test_hello_world_basic() {
    let program_id = Pubkey::default();
    let accounts = vec![];
    let instruction_data = vec![];
    
    let result = process_instruction(&program_id, &accounts, &instruction_data);
    assert!(result.is_ok(), "Hello world program should execute successfully");
}

#[test]
fn test_hello_world_with_data() {
    let program_id = Pubkey::default();
    let accounts = vec![];
    let instruction_data = vec![1, 2, 3, 4];
    
    let result = process_instruction(&program_id, &accounts, &instruction_data);
    assert!(result.is_ok(), "Hello world program should handle instruction data");
}

#[test]
fn test_hello_world_with_accounts() {
    let program_id = Pubkey::default();
    let key = Pubkey::default();
    let mut lamports = 0;
    let mut data = vec![0; 100];
    let owner = Pubkey::default();
    
    let account_info = AccountInfo::new(
        &key,
        false,
        true,
        &mut lamports,
        &mut data,
        &owner,
        false,
        0,
    );
    
    let accounts = vec![account_info];
    let instruction_data = vec![];
    
    let result = process_instruction(&program_id, &accounts, &instruction_data);
    assert!(result.is_ok(), "Hello world program should handle accounts");
} 