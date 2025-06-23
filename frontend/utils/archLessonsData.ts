// Arch Network Lesson Data - Based on official examples from arch-examples repository
// Reference: https://github.com/Arch-Network/arch-examples/tree/main/examples

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  href: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  objectives: string[];
  concepts: string[];
  exampleSource?: string; // Reference to arch-examples
  initialCode: string;
  solution?: string;
  tests?: string;
}

export const archLessonsData: LessonContent[] = [
  {
    id: 1,
    title: "Hello World",
    description:
      "Learn the basics of Arch programming with your first program. Understand the fundamental structure and entry points.",
    difficulty: "Beginner",
    duration: "15 min",
    href: "/tracks/arch/lesson1",
    isCompleted: false,
    isUnlocked: true,
    objectives: [
      "Understand Arch program structure",
      "Learn about the entrypoint macro",
      "Use the msg! macro for output",
      "Compile and run your first program",
    ],
    concepts: ["entrypoint", "msg! macro", "ProgramResult", "basic imports"],
    exampleSource: "https://github.com/Arch-Network/arch-examples",
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello, Arch World!");
    Ok(())
}`,
  },
  {
    id: 2,
    title: "Variables & Data Types",
    description:
      "Master Arch data types, variable declarations, and memory management in blockchain programs.",
    difficulty: "Beginner",
    duration: "20 min",
    href: "/tracks/arch/lesson2",
    isCompleted: false,
    isUnlocked: false,
    objectives: [
      "Learn Arch data types",
      "Understand variable declarations",
      "Work with numbers, strings, and booleans",
      "Practice memory management",
    ],
    concepts: ["u64", "String", "bool", "Vec", "Option", "Result"],
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // TODO: Declare variables of different types
    let counter: u64 = 0;
    let message: String = String::from("Learning Arch!");
    let is_active: bool = true;
    
    msg!("Counter: {}, Message: {}, Active: {}", counter, message, is_active);
    
    // TODO: Parse instruction data
    if !instruction_data.is_empty() {
        let value = u64::from_le_bytes(
            instruction_data[0..8].try_into().unwrap()
        );
        msg!("Received value: {}", value);
    }
    
    Ok(())
}`,
  },
  {
    id: 3,
    title: "Account Management",
    description:
      "Learn to work with accounts, read account data, and manage state in your Arch programs.",
    difficulty: "Beginner",
    duration: "25 min",
    href: "/tracks/arch/lesson3",
    isCompleted: false,
    isUnlocked: false,
    objectives: [
      "Understand Arch account model",
      "Read and write account data",
      "Handle account ownership",
      "Implement basic state management",
    ],
    concepts: [
      "AccountInfo",
      "account data",
      "ownership",
      "rent",
      "account creation",
    ],
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Account Management Program");
    
    let accounts_iter = &mut accounts.iter();
    
    // TODO: Get the account to work with
    let account = next_account_info(accounts_iter)?;
    
    // TODO: Check account ownership
    if account.owner != program_id {
        msg!("Account not owned by this program");
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // TODO: Read account data
    msg!("Account pubkey: {}", account.key);
    msg!("Account lamports: {}", account.lamports());
    msg!("Account data length: {}", account.data_len());
    
    Ok(())
}

use arch_program::account::next_account_info;`,
  },
  {
    id: 4,
    title: "Instruction Processing",
    description:
      "Deep dive into instruction data processing, serialization, and program logic flow.",
    difficulty: "Intermediate",
    duration: "30 min",
    href: "/tracks/arch/lesson4",
    isCompleted: false,
    isUnlocked: false,
    objectives: [
      "Parse complex instruction data",
      "Implement instruction enums",
      "Handle different instruction types",
      "Add proper error handling",
    ],
    concepts: [
      "instruction parsing",
      "enums",
      "match statements",
      "borsh serialization",
    ],
    exampleSource: "https://github.com/Arch-Network/arch-examples",
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    Increment { amount: u64 },
    Decrement { amount: u64 },
    Reset,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Instruction Processing Program");
    
    // TODO: Parse instruction data
    let instruction = CounterInstruction::try_from_slice(instruction_data)?;
    
    match instruction {
        CounterInstruction::Increment { amount } => {
            msg!("Increment by: {}", amount);
            // TODO: Implement increment logic
        }
        CounterInstruction::Decrement { amount } => {
            msg!("Decrement by: {}", amount);
            // TODO: Implement decrement logic
        }
        CounterInstruction::Reset => {
            msg!("Reset counter");
            // TODO: Implement reset logic
        }
    }
    
    Ok(())
}`,
  },
  {
    id: 5,
    title: "Program Derived Addresses",
    description:
      "Master PDAs, cross-program invocations, and advanced account management techniques.",
    difficulty: "Intermediate",
    duration: "35 min",
    href: "/tracks/arch/lesson5",
    isCompleted: false,
    isUnlocked: false,
    objectives: [
      "Understand PDA concepts",
      "Generate PDAs with seeds",
      "Implement cross-program invocations",
      "Manage program-owned accounts",
    ],
    concepts: [
      "PDA",
      "seeds",
      "CPI",
      "program-owned accounts",
      "address derivation",
    ],
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("PDA and CPI Program");
    
    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // TODO: Define PDA seeds
    let seed = b"counter";
    let bump_seed = instruction_data[0];
    
    // TODO: Derive PDA address
    let pda_address = Pubkey::create_program_address(
        &[seed, &[bump_seed]],
        program_id,
    )?;
    
    // TODO: Verify PDA matches expected address
    if pda_account.key != &pda_address {
        msg!("PDA address mismatch");
        return Err(ProgramError::InvalidAccountData);
    }
    
    // TODO: Create PDA account if it doesn't exist
    if pda_account.lamports() == 0 {
        let rent = Rent::get()?;
        let space = 8; // u64 counter
        let lamports = rent.minimum_balance(space);
        
        let create_account_ix = system_instruction::create_account(
            payer.key,
            pda_account.key,
            lamports,
            space as u64,
            program_id,
        );
        
        invoke_signed(
            &create_account_ix,
            &[payer.clone(), pda_account.clone(), system_program.clone()],
            &[&[seed, &[bump_seed]]],
        )?;
    }
    
    msg!("PDA account ready: {}", pda_account.key);
    Ok(())
}

use arch_program::account::next_account_info;`,
  },
  {
    id: 6,
    title: "Token Operations",
    description:
      "Learn to create, mint, and transfer tokens using Arch's token program interfaces.",
    difficulty: "Intermediate",
    duration: "40 min",
    href: "/tracks/arch/lesson6",
    isCompleted: false,
    isUnlocked: false,
    objectives: [
      "Understand token program architecture",
      "Create token mints and accounts",
      "Implement mint and transfer operations",
      "Handle token program CPIs",
    ],
    concepts: [
      "token program",
      "mint",
      "token accounts",
      "transfers",
      "authorities",
    ],
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// TODO: Import token program types
// use spl_token::{instruction as token_instruction, state::Mint};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Token Operations Program");
    
    let accounts_iter = &mut accounts.iter();
    let authority = next_account_info(accounts_iter)?;
    let mint_account = next_account_info(accounts_iter)?;
    let token_account = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    
    // TODO: Parse amount from instruction data
    let amount = u64::from_le_bytes(
        instruction_data[0..8].try_into().unwrap()
    );
    
    msg!("Minting {} tokens", amount);
    
    // TODO: Create mint instruction
    /*
    let mint_ix = token_instruction::mint_to(
        token_program.key,
        mint_account.key,
        token_account.key,
        authority.key,
        &[],
        amount,
    )?;
    
    invoke(
        &mint_ix,
        &[
            mint_account.clone(),
            token_account.clone(),
            authority.clone(),
            token_program.clone(),
        ],
    )?;
    */
    
    msg!("Tokens minted successfully");
    Ok(())
}

use arch_program::account::next_account_info;`,
  },
  {
    id: 7,
    title: "Smart Contract Interactions",
    description:
      "Build complex smart contracts that interact with other programs and external data.",
    difficulty: "Advanced",
    duration: "45 min",
    href: "/tracks/arch/lesson7",
    isCompleted: false,
    isUnlocked: false,
    objectives: [
      "Design multi-program interactions",
      "Implement program-to-program calls",
      "Handle complex state management",
      "Add oracle data integration",
    ],
    concepts: [
      "CPI",
      "program interactions",
      "state management",
      "oracles",
      "composability",
    ],
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GameState {
    pub player: Pubkey,
    pub score: u64,
    pub level: u32,
    pub items: Vec<u32>,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Smart Contract Interactions Program");
    
    let accounts_iter = &mut accounts.iter();
    let player = next_account_info(accounts_iter)?;
    let game_state_account = next_account_info(accounts_iter)?;
    let external_program = next_account_info(accounts_iter)?;
    
    // TODO: Load game state
    let mut game_state = if game_state_account.data_len() > 0 {
        GameState::try_from_slice(&game_state_account.data.borrow())?
    } else {
        GameState {
            player: *player.key,
            score: 0,
            level: 1,
            items: vec![],
        }
    };
    
    // TODO: Parse action from instruction data
    let action = instruction_data[0];
    
    match action {
        0 => {
            // Increase score
            game_state.score += 10;
            msg!("Score increased to: {}", game_state.score);
        }
        1 => {
            // Level up
            if game_state.score >= 100 {
                game_state.level += 1;
                msg!("Level up! Now level: {}", game_state.level);
            }
        }
        2 => {
            // Add item
            let item_id = u32::from_le_bytes(
                instruction_data[1..5].try_into().unwrap()
            );
            game_state.items.push(item_id);
            msg!("Added item: {}", item_id);
        }
        _ => {
            return Err(ProgramError::InvalidInstructionData);
        }
    }
    
    // TODO: Save updated state
    let serialized_state = game_state.try_to_vec()?;
    game_state_account.data.borrow_mut()[..serialized_state.len()]
        .copy_from_slice(&serialized_state);
    
    Ok(())
}

use arch_program::account::next_account_info;`,
  },
  {
    id: 8,
    title: "DeFi Protocol Development",
    description:
      "Create a complete DeFi protocol with swaps, liquidity pools, and yield farming mechanics.",
    difficulty: "Advanced",
    duration: "60 min",
    href: "/tracks/arch/lesson8",
    isCompleted: false,
    isUnlocked: false,
    objectives: [
      "Build automated market makers",
      "Implement liquidity pools",
      "Create yield farming mechanics",
      "Add governance features",
    ],
    concepts: [
      "AMM",
      "liquidity pools",
      "yield farming",
      "governance",
      "DeFi primitives",
    ],
    exampleSource: "https://github.com/Arch-Network/arch-examples",
    initialCode: `use arch_program::{
    account::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct LiquidityPool {
    pub token_a_reserve: u64,
    pub token_b_reserve: u64,
    pub lp_token_supply: u64,
    pub fee_rate: u16, // basis points (100 = 1%)
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum DeFiInstruction {
    AddLiquidity { amount_a: u64, amount_b: u64 },
    RemoveLiquidity { lp_amount: u64 },
    Swap { amount_in: u64, minimum_out: u64 },
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("DeFi Protocol Program");
    
    let instruction = DeFiInstruction::try_from_slice(instruction_data)?;
    
    match instruction {
        DeFiInstruction::AddLiquidity { amount_a, amount_b } => {
            msg!("Adding liquidity: {} A, {} B", amount_a, amount_b);
            // TODO: Implement liquidity addition logic
            add_liquidity(accounts, amount_a, amount_b)
        }
        DeFiInstruction::RemoveLiquidity { lp_amount } => {
            msg!("Removing liquidity: {} LP tokens", lp_amount);
            // TODO: Implement liquidity removal logic
            remove_liquidity(accounts, lp_amount)
        }
        DeFiInstruction::Swap { amount_in, minimum_out } => {
            msg!("Swapping {} with minimum out {}", amount_in, minimum_out);
            // TODO: Implement swap logic
            swap_tokens(accounts, amount_in, minimum_out)
        }
    }
}

fn add_liquidity(
    accounts: &[AccountInfo],
    amount_a: u64,
    amount_b: u64,
) -> ProgramResult {
    // TODO: Implement AMM liquidity addition
    msg!("Liquidity added successfully");
    Ok(())
}

fn remove_liquidity(
    accounts: &[AccountInfo],
    lp_amount: u64,
) -> ProgramResult {
    // TODO: Implement liquidity removal
    msg!("Liquidity removed successfully");
    Ok(())
}

fn swap_tokens(
    accounts: &[AccountInfo],
    amount_in: u64,
    minimum_out: u64,
) -> ProgramResult {
    // TODO: Implement AMM swap with constant product formula
    // price = token_a_reserve / token_b_reserve
    // amount_out = (amount_in * token_b_reserve) / (token_a_reserve + amount_in)
    msg!("Swap completed successfully");
    Ok(())
}

use arch_program::account::next_account_info;`,
  },
];

// Helper function to get lesson by ID
export function getLessonById(id: number): LessonContent | undefined {
  return archLessonsData.find((lesson) => lesson.id === id);
}

// Helper function to get unlocked lessons
export function getUnlockedLessons(): LessonContent[] {
  return archLessonsData.filter((lesson) => lesson.isUnlocked);
}

// Helper function to get completed lessons
export function getCompletedLessons(): LessonContent[] {
  return archLessonsData.filter((lesson) => lesson.isCompleted);
}
