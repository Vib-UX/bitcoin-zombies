use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

/// Define the program entrypoint
entrypoint!(process_instruction);

/// Program entrypoint implementation
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Log messages to the program log
    msg!("Hello, Arch World!");
    msg!("Program ID: {}", program_id);
    msg!("Number of accounts: {}", accounts.len());
    msg!("Instruction data length: {}", instruction_data.len());
    
    // Process the instruction based on the data received
    match instruction_data.len() {
        0 => {
            msg!("No instruction data provided - running basic hello world");
        }
        _ => {
            msg!("Received instruction data: {:?}", instruction_data);
        }
    }
    
    msg!("Hello World program completed successfully!");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use arch_program::pubkey::Pubkey;

    #[test]
    fn test_process_instruction() {
        let program_id = Pubkey::default();
        let accounts = vec![];
        let instruction_data = vec![];
        
        let result = process_instruction(&program_id, &accounts, &instruction_data);
        assert!(result.is_ok());
    }
} 