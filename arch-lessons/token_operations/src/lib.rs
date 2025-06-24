use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
};
use borsh::{BorshDeserialize, BorshSerialize};

// ============================================================================
// TOKEN OPERATIONS LESSON - Interactive Examples
// ============================================================================
// This lesson demonstrates comprehensive token operations on Arch Network
// Based on real-world examples from the Arch ecosystem
// Students will learn: minting, transfers, approvals, burning, and more!

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum TokenInstruction {
    /// Initialize a new token mint
    /// Accounts expected:
    /// 0. `[writable]` The mint account to initialize
    /// 1. `[]` The mint authority
    /// 2. `[]` The freeze authority (optional)
    InitializeMint { decimals: u8 },
    
    /// Initialize a new token account
    /// Accounts expected:
    /// 0. `[writable]` The token account to initialize
    /// 1. `[]` The mint account
    /// 2. `[]` The owner of the token account
    InitializeAccount,
    
    /// Mint tokens to an account
    /// Accounts expected:
    /// 0. `[writable]` The mint account
    /// 1. `[writable]` The destination token account
    /// 2. `[signer]` The mint authority
    MintTo { amount: u64 },
    
    /// Transfer tokens between accounts
    /// Accounts expected:
    /// 0. `[writable]` The source token account
    /// 1. `[writable]` The destination token account
    /// 2. `[signer]` The owner of the source account
    Transfer { amount: u64 },
    
    /// Approve a delegate to spend tokens
    /// Accounts expected:
    /// 0. `[writable]` The token account to approve from
    /// 1. `[]` The delegate account
    /// 2. `[signer]` The owner of the token account
    Approve { amount: u64 },
    
    /// Revoke a previously approved delegate
    /// Accounts expected:
    /// 0. `[writable]` The token account
    /// 1. `[signer]` The owner of the token account
    Revoke,
    
    /// Burn tokens from an account
    /// Accounts expected:
    /// 0. `[writable]` The token account to burn from
    /// 1. `[writable]` The mint account
    /// 2. `[signer]` The owner of the token account
    Burn { amount: u64 },
    
    /// Freeze a token account
    /// Accounts expected:
    /// 0. `[writable]` The token account to freeze
    /// 1. `[]` The mint account
    /// 2. `[signer]` The freeze authority
    FreezeAccount,
    
    /// Thaw a frozen token account
    /// Accounts expected:
    /// 0. `[writable]` The token account to thaw
    /// 1. `[]` The mint account
    /// 2. `[signer]` The freeze authority
    ThawAccount,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Mint {
    pub mint_authority: Option<Pubkey>,
    pub supply: u64,
    pub decimals: u8,
    pub is_initialized: bool,
    pub freeze_authority: Option<Pubkey>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct TokenAccount {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub delegate: Option<Pubkey>,
    pub state: AccountState,
    pub is_native: Option<u64>,
    pub delegated_amount: u64,
    pub close_authority: Option<Pubkey>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub enum AccountState {
    Uninitialized,
    Initialized,
    Frozen,
}

impl Mint {
    pub const LEN: usize = 82; // Size of mint account data
}

impl TokenAccount {
    pub const LEN: usize = 165; // Size of token account data
}

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = TokenInstruction::try_from_slice(instruction_data)?;
    
    match instruction {
        TokenInstruction::InitializeMint { decimals } => {
            msg!("Instruction: Initialize Mint");
            process_initialize_mint(accounts, decimals)
        }
        TokenInstruction::InitializeAccount => {
            msg!("Instruction: Initialize Token Account");
            process_initialize_account(accounts)
        }
        TokenInstruction::MintTo { amount } => {
            msg!("Instruction: Mint To");
            process_mint_to(accounts, amount)
        }
        TokenInstruction::Transfer { amount } => {
            msg!("Instruction: Transfer");
            process_transfer(accounts, amount)
        }
        TokenInstruction::Approve { amount } => {
            msg!("Instruction: Approve");
            process_approve(accounts, amount)
        }
        TokenInstruction::Revoke => {
            msg!("Instruction: Revoke");
            process_revoke(accounts)
        }
        TokenInstruction::Burn { amount } => {
            msg!("Instruction: Burn");
            process_burn(accounts, amount)
        }
        TokenInstruction::FreezeAccount => {
            msg!("Instruction: Freeze Account");
            process_freeze_account(accounts)
        }
        TokenInstruction::ThawAccount => {
            msg!("Instruction: Thaw Account");
            process_thaw_account(accounts)
        }
    }
}

fn process_initialize_mint(accounts: &[AccountInfo], decimals: u8) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let mint_info = next_account_info(account_info_iter)?;
    let mint_authority_info = next_account_info(account_info_iter)?;
    let freeze_authority_info = account_info_iter.next();
    
    // TODO: Add validation checks
    // - Verify mint account is writable
    // - Check that mint account is not already initialized
    // - Validate decimals (typically 0-9)
    
    if mint_info.data_len() != Mint::LEN {
        return Err(ProgramError::InvalidAccountData);
    }
    
    let freeze_authority = freeze_authority_info.map(|info| *info.key);
    
    let mint = Mint {
        mint_authority: Some(*mint_authority_info.key),
        supply: 0,
        decimals,
        is_initialized: true,
        freeze_authority,
    };
    
    // TODO: Serialize and store mint data
    let mint_data = mint.try_to_vec()?;
    mint_info.data.borrow_mut()[..mint_data.len()].copy_from_slice(&mint_data);
    
    msg!("Mint initialized with {} decimals", decimals);
    Ok(())
}

fn process_initialize_account(accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let token_account_info = next_account_info(account_info_iter)?;
    let mint_info = next_account_info(account_info_iter)?;
    let owner_info = next_account_info(account_info_iter)?;
    
    // TODO: Add validation checks
    // - Verify token account is writable
    // - Check that token account is not already initialized
    // - Validate that mint account exists and is initialized
    
    if token_account_info.data_len() != TokenAccount::LEN {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // TODO: Verify mint account is valid
    let mint_data = Mint::try_from_slice(&mint_info.data.borrow())?;
    if !mint_data.is_initialized {
        return Err(ProgramError::UninitializedAccount);
    }
    
    let token_account = TokenAccount {
        mint: *mint_info.key,
        owner: *owner_info.key,
        amount: 0,
        delegate: None,
        state: AccountState::Initialized,
        is_native: None,
        delegated_amount: 0,
        close_authority: None,
    };
    
    // TODO: Serialize and store token account data
    let account_data = token_account.try_to_vec()?;
    token_account_info.data.borrow_mut()[..account_data.len()].copy_from_slice(&account_data);
    
    msg!("Token account initialized for mint: {}", mint_info.key);
    Ok(())
}

fn process_mint_to(accounts: &[AccountInfo], amount: u64) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let mint_info = next_account_info(account_info_iter)?;
    let destination_info = next_account_info(account_info_iter)?;
    let authority_info = next_account_info(account_info_iter)?;
    
    // TODO: Implement mint_to logic
    // 1. Load and validate mint account
    // 2. Check mint authority signature
    // 3. Load and validate destination token account
    // 4. Update mint supply
    // 5. Update destination account balance
    
    let mut mint_data = Mint::try_from_slice(&mint_info.data.borrow())?;
    let mut dest_account = TokenAccount::try_from_slice(&destination_info.data.borrow())?;
    
    // Validate authority
    if mint_data.mint_authority != Some(*authority_info.key) {
        return Err(ProgramError::InvalidArgument);
    }
    
    if !authority_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // TODO: Add overflow checks
    mint_data.supply = mint_data.supply.checked_add(amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    dest_account.amount = dest_account.amount.checked_add(amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    
    // Save updated data
    let mint_serialized = mint_data.try_to_vec()?;
    mint_info.data.borrow_mut()[..mint_serialized.len()].copy_from_slice(&mint_serialized);
    
    let dest_serialized = dest_account.try_to_vec()?;
    destination_info.data.borrow_mut()[..dest_serialized.len()].copy_from_slice(&dest_serialized);
    
    msg!("Minted {} tokens to account", amount);
    Ok(())
}

fn process_transfer(accounts: &[AccountInfo], amount: u64) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let source_info = next_account_info(account_info_iter)?;
    let destination_info = next_account_info(account_info_iter)?;
    let authority_info = next_account_info(account_info_iter)?;
    
    // TODO: Implement transfer logic
    // 1. Load source and destination accounts
    // 2. Validate authority (owner or delegate)
    // 3. Check sufficient balance
    // 4. Handle delegate logic if applicable
    // 5. Update balances
    
    let mut source_account = TokenAccount::try_from_slice(&source_info.data.borrow())?;
    let mut dest_account = TokenAccount::try_from_slice(&destination_info.data.borrow())?;
    
    // Validate accounts are from same mint
    if source_account.mint != dest_account.mint {
        return Err(ProgramError::InvalidArgument);
    }
    
    // Check authority
    let is_owner = source_account.owner == *authority_info.key;
    let is_delegate = source_account.delegate == Some(*authority_info.key);
    
    if !is_owner && !is_delegate {
        return Err(ProgramError::InvalidArgument);
    }
    
    if !authority_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // TODO: Implement balance checks and updates
    if source_account.amount < amount {
        return Err(ProgramError::InsufficientFunds);
    }
    
    source_account.amount = source_account.amount.checked_sub(amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    dest_account.amount = dest_account.amount.checked_add(amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    
    // Handle delegate spending
    if is_delegate {
        if source_account.delegated_amount < amount {
            return Err(ProgramError::InsufficientFunds);
        }
        source_account.delegated_amount = source_account.delegated_amount.checked_sub(amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;
    }
    
    // Save updated accounts
    let source_serialized = source_account.try_to_vec()?;
    source_info.data.borrow_mut()[..source_serialized.len()].copy_from_slice(&source_serialized);
    
    let dest_serialized = dest_account.try_to_vec()?;
    destination_info.data.borrow_mut()[..dest_serialized.len()].copy_from_slice(&dest_serialized);
    
    msg!("Transferred {} tokens", amount);
    Ok(())
}

fn process_approve(accounts: &[AccountInfo], amount: u64) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let token_account_info = next_account_info(account_info_iter)?;
    let delegate_info = next_account_info(account_info_iter)?;
    let owner_info = next_account_info(account_info_iter)?;
    
    // TODO: Implement approve logic
    // 1. Load token account
    // 2. Validate owner signature
    // 3. Set delegate and delegated amount
    
    let mut token_account = TokenAccount::try_from_slice(&token_account_info.data.borrow())?;
    
    if token_account.owner != *owner_info.key {
        return Err(ProgramError::InvalidArgument);
    }
    
    if !owner_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    token_account.delegate = Some(*delegate_info.key);
    token_account.delegated_amount = amount;
    
    let serialized = token_account.try_to_vec()?;
    token_account_info.data.borrow_mut()[..serialized.len()].copy_from_slice(&serialized);
    
    msg!("Approved {} tokens for delegate", amount);
    Ok(())
}

fn process_revoke(accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let token_account_info = next_account_info(account_info_iter)?;
    let owner_info = next_account_info(account_info_iter)?;
    
    // TODO: Implement revoke logic
    let mut token_account = TokenAccount::try_from_slice(&token_account_info.data.borrow())?;
    
    if token_account.owner != *owner_info.key {
        return Err(ProgramError::InvalidArgument);
    }
    
    if !owner_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    token_account.delegate = None;
    token_account.delegated_amount = 0;
    
    let serialized = token_account.try_to_vec()?;
    token_account_info.data.borrow_mut()[..serialized.len()].copy_from_slice(&serialized);
    
    msg!("Revoked delegate approval");
    Ok(())
}

fn process_burn(accounts: &[AccountInfo], amount: u64) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let token_account_info = next_account_info(account_info_iter)?;
    let mint_info = next_account_info(account_info_iter)?;
    let authority_info = next_account_info(account_info_iter)?;
    
    // TODO: Implement burn logic
    // Similar to transfer but removes tokens from circulation
    
    let mut token_account = TokenAccount::try_from_slice(&token_account_info.data.borrow())?;
    let mut mint_data = Mint::try_from_slice(&mint_info.data.borrow())?;
    
    // Validate authority and balance
    if token_account.owner != *authority_info.key {
        return Err(ProgramError::InvalidArgument);
    }
    
    if token_account.amount < amount {
        return Err(ProgramError::InsufficientFunds);
    }
    
    // Update balances
    token_account.amount = token_account.amount.checked_sub(amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    mint_data.supply = mint_data.supply.checked_sub(amount)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    
    // Save data
    let token_serialized = token_account.try_to_vec()?;
    token_account_info.data.borrow_mut()[..token_serialized.len()].copy_from_slice(&token_serialized);
    
    let mint_serialized = mint_data.try_to_vec()?;
    mint_info.data.borrow_mut()[..mint_serialized.len()].copy_from_slice(&mint_serialized);
    
    msg!("Burned {} tokens", amount);
    Ok(())
}

fn process_freeze_account(accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let token_account_info = next_account_info(account_info_iter)?;
    let mint_info = next_account_info(account_info_iter)?;
    let freeze_authority_info = next_account_info(account_info_iter)?;
    
    // TODO: Implement freeze logic
    let mut token_account = TokenAccount::try_from_slice(&token_account_info.data.borrow())?;
    let mint_data = Mint::try_from_slice(&mint_info.data.borrow())?;
    
    // Validate freeze authority
    if mint_data.freeze_authority != Some(*freeze_authority_info.key) {
        return Err(ProgramError::InvalidArgument);
    }
    
    token_account.state = AccountState::Frozen;
    
    let serialized = token_account.try_to_vec()?;
    token_account_info.data.borrow_mut()[..serialized.len()].copy_from_slice(&serialized);
    
    msg!("Account frozen");
    Ok(())
}

fn process_thaw_account(accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let token_account_info = next_account_info(account_info_iter)?;
    let mint_info = next_account_info(account_info_iter)?;
    let freeze_authority_info = next_account_info(account_info_iter)?;
    
    // TODO: Implement thaw logic
    let mut token_account = TokenAccount::try_from_slice(&token_account_info.data.borrow())?;
    let mint_data = Mint::try_from_slice(&mint_info.data.borrow())?;
    
    // Validate freeze authority
    if mint_data.freeze_authority != Some(*freeze_authority_info.key) {
        return Err(ProgramError::InvalidArgument);
    }
    
    token_account.state = AccountState::Initialized;
    
    let serialized = token_account.try_to_vec()?;
    token_account_info.data.borrow_mut()[..serialized.len()].copy_from_slice(&serialized);
    
    msg!("Account thawed");
    Ok(())
}

use arch_program::account::next_account_info; 