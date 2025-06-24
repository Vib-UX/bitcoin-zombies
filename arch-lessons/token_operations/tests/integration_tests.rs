// ============================================================================
// TOKEN OPERATIONS INTEGRATION TESTS - Interactive Learning
// ============================================================================
// These tests demonstrate real-world token operations on Arch Network
// Students will complete TODOs to make tests pass and learn by doing!

#[cfg(test)]
mod tests {
    use super::*;
    use arch_program::{program_pack::Pack, sanitized::ArchMessage};
    use arch_sdk::{build_and_sign_transaction, generate_new_keypair, ArchRpcClient, Status};
    use arch_test_sdk::{
        constants::{BITCOIN_NETWORK, NODE1_ADDRESS},
        helper::{
            create_and_fund_account_with_faucet, read_account_info, send_transactions_and_wait,
        },
        logging::init_logging,
    };
    use serial_test::serial;
    use token_operations::*;

    // ========================================================================
    // TEST 1: Initialize Mint - Create Your First Token
    // ========================================================================
    // This test shows how to create a new token mint on Arch Network
    // A mint is like a "token factory" that can create new tokens
    
    #[ignore] // Remove this to run the test
    #[test]
    #[serial]
    fn test_initialize_mint() {
        init_logging();
        
        let client = ArchRpcClient::new(NODE1_ADDRESS);
        
        // TODO: Generate keypairs for authority and mint
        // The authority controls who can mint tokens
        let (authority_keypair, authority_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&authority_keypair, BITCOIN_NETWORK);
        
        let (token_mint_keypair, token_mint_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        
        // TODO: Create the mint account with proper size
        // Mint accounts need specific amount of space to store mint data
        create_account_helper(
            &client,
            &authority_pubkey,
            &token_mint_pubkey,
            authority_keypair,
            token_mint_keypair,
            Mint::LEN as u64, // Size needed for mint data
        );
        
        // TODO: Create the initialize mint instruction
        // This sets up the mint with decimals and authorities
        let initialize_mint_instruction = TokenInstruction::InitializeMint { 
            decimals: 9 // Most tokens use 9 decimals (like Bitcoin's satoshis)
        };
        
        let instruction_data = initialize_mint_instruction.try_to_vec().unwrap();
        
        // TODO: Build and send the transaction
        let transaction = build_and_sign_transaction(
            ArchMessage::new(
                &[/* TODO: Add your instruction here */],
                Some(authority_pubkey),
                client.get_best_block_hash().unwrap(),
            ),
            vec![authority_keypair, token_mint_keypair],
            BITCOIN_NETWORK,
        );
        
        let processed_transactions = send_transactions_and_wait(vec![transaction]);
        assert!(processed_transactions[0].status == Status::Processed);
        
        // TODO: Verify the mint was created correctly
        let token_mint_info = read_account_info(token_mint_pubkey);
        let token_mint_data = Mint::try_from_slice(&token_mint_info.data).unwrap();
        
        assert_eq!(token_mint_data.decimals, 9);
        assert!(token_mint_data.is_initialized);
        assert_eq!(token_mint_data.mint_authority.unwrap(), authority_pubkey);
        
        println!("✅ Mint initialized successfully!");
        println!("   Decimals: {}", token_mint_data.decimals);
        println!("   Supply: {}", token_mint_data.supply);
        println!("   Authority: {}", authority_pubkey);
    }
    
    // ========================================================================
    // TEST 2: Initialize Token Account - Create a Wallet for Tokens
    // ========================================================================
    // Token accounts are like wallets that hold specific tokens
    // Each token account is tied to one mint and one owner
    
    #[ignore] // Remove this to run the test
    #[test]
    #[serial]
    fn test_initialize_account() {
        init_logging();
        
        let client = ArchRpcClient::new(NODE1_ADDRESS);
        
        let (authority_keypair, authority_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&authority_keypair, BITCOIN_NETWORK);
        
        let (token_account_keypair, token_account_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        
        // TODO: First create a mint (reuse logic from test 1)
        let (_token_mint_keypair, token_mint_pubkey) = 
            initialize_mint_token(&client, authority_pubkey, authority_keypair, None);
        
        // TODO: Create the token account with proper size
        create_account_helper(
            &client,
            &authority_pubkey,
            &token_account_pubkey,
            authority_keypair,
            token_account_keypair,
            TokenAccount::LEN as u64, // Size needed for token account data
        );
        
        // TODO: Create the initialize account instruction
        let initialize_account_instruction = TokenInstruction::InitializeAccount;
        let instruction_data = initialize_account_instruction.try_to_vec().unwrap();
        
        // TODO: Build transaction with proper accounts
        // Account order matters! Check the instruction definition
        let transaction = build_and_sign_transaction(
            ArchMessage::new(
                &[/* TODO: Add your instruction */],
                Some(authority_pubkey),
                client.get_best_block_hash().unwrap(),
            ),
            vec![authority_keypair],
            BITCOIN_NETWORK,
        );
        
        let processed_transactions = send_transactions_and_wait(vec![transaction]);
        assert!(processed_transactions[0].status == Status::Processed);
        
        // TODO: Verify the token account was created correctly
        let token_account_data = read_account_info(token_account_pubkey);
        let token_account: TokenAccount = 
            TokenAccount::try_from_slice(&token_account_data.data).unwrap();
            
        assert_eq!(token_account.mint, token_mint_pubkey);
        assert_eq!(token_account.owner, authority_pubkey);
        assert_eq!(token_account.state, AccountState::Initialized);
        assert_eq!(token_account.amount, 0); // New accounts start with 0 tokens
        
        println!("✅ Token account initialized successfully!");
        println!("   Owner: {}", token_account.owner);
        println!("   Mint: {}", token_account.mint);
        println!("   Balance: {}", token_account.amount);
    }
    
    // ========================================================================
    // TEST 3: Mint Tokens - Create New Tokens
    // ========================================================================
    // Minting creates new tokens and adds them to the total supply
    // Only the mint authority can mint new tokens
    
    #[ignore] // Remove this to run the test
    #[test]
    #[serial]
    fn test_mint_to() {
        init_logging();
        
        let client = ArchRpcClient::new(NODE1_ADDRESS);
        
        let (authority_keypair, authority_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&authority_keypair, BITCOIN_NETWORK);
        
        // TODO: Create mint and token account
        let (_, token_mint_pubkey) = 
            initialize_mint_token(&client, authority_pubkey, authority_keypair, None);
        let (_, authority_token_account_pubkey) = 
            initialize_token_account(&client, token_mint_pubkey, authority_keypair);
        
        // TODO: Create mint instruction
        let mint_amount = 1000; // Mint 1000 tokens
        let mint_instruction = TokenInstruction::MintTo { amount: mint_amount };
        let instruction_data = mint_instruction.try_to_vec().unwrap();
        
        // TODO: Build and send transaction
        let transaction = build_and_sign_transaction(
            ArchMessage::new(
                &[/* TODO: Add your instruction */],
                Some(authority_pubkey),
                client.get_best_block_hash().unwrap(),
            ),
            vec![authority_keypair],
            BITCOIN_NETWORK,
        );
        
        let processed_tx = send_transactions_and_wait(vec![transaction]);
        assert_eq!(processed_tx[0].status, Status::Processed);
        
        // TODO: Verify tokens were minted
        let authority_token_account_info = read_account_info(authority_token_account_pubkey);
        let authority_token_account_data = 
            TokenAccount::try_from_slice(&authority_token_account_info.data).unwrap();
        
        assert_eq!(authority_token_account_data.amount, mint_amount);
        
        // TODO: Also check that mint supply increased
        let mint_info = read_account_info(token_mint_pubkey);
        let mint_data = Mint::try_from_slice(&mint_info.data).unwrap();
        assert_eq!(mint_data.supply, mint_amount);
        
        println!("✅ Minted {} tokens successfully!", mint_amount);
        println!("   Account balance: {}", authority_token_account_data.amount);
        println!("   Total supply: {}", mint_data.supply);
    }
    
    // ========================================================================
    // TEST 4: Transfer Tokens - Send Tokens Between Accounts
    // ========================================================================
    // Transfers move tokens from one account to another
    // The sender must have sufficient balance and sign the transaction
    
    #[ignore] // Remove this to run the test
    #[test]
    #[serial]
    fn test_transfer() {
        init_logging();
        
        let client = ArchRpcClient::new(NODE1_ADDRESS);
        
        // TODO: Set up two users
        let (authority_keypair, authority_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&authority_keypair, BITCOIN_NETWORK);
        
        let (recipient_keypair, recipient_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&recipient_keypair, BITCOIN_NETWORK);
        
        // TODO: Create mint and token accounts for both users
        let (_, token_mint_pubkey) = 
            initialize_mint_token(&client, authority_pubkey, authority_keypair, None);
        let (_, authority_token_account_pubkey) = 
            initialize_token_account(&client, token_mint_pubkey, authority_keypair);
        let (_, recipient_token_account_pubkey) = 
            initialize_token_account(&client, token_mint_pubkey, recipient_keypair);
        
        // TODO: Mint some tokens to the sender
        let initial_amount = 1000;
        mint_tokens(
            &client,
            &token_mint_pubkey,
            &authority_token_account_pubkey,
            &authority_pubkey,
            authority_keypair,
            initial_amount,
        );
        
        // TODO: Transfer tokens
        let transfer_amount = 250;
        let transfer_instruction = TokenInstruction::Transfer { amount: transfer_amount };
        let instruction_data = transfer_instruction.try_to_vec().unwrap();
        
        let transaction = build_and_sign_transaction(
            ArchMessage::new(
                &[/* TODO: Add your instruction */],
                Some(authority_pubkey),
                client.get_best_block_hash().unwrap(),
            ),
            vec![authority_keypair],
            BITCOIN_NETWORK,
        );
        
        let processed_transactions = send_transactions_and_wait(vec![transaction]);
        assert!(processed_transactions[0].status == Status::Processed);
        
        // TODO: Verify the transfer worked
        let recipient_token_account_info = read_account_info(recipient_token_account_pubkey);
        let recipient_data = TokenAccount::try_from_slice(&recipient_token_account_info.data).unwrap();
        
        let sender_token_account_info = read_account_info(authority_token_account_pubkey);
        let sender_data = TokenAccount::try_from_slice(&sender_token_account_info.data).unwrap();
        
        assert_eq!(recipient_data.amount, transfer_amount);
        assert_eq!(sender_data.amount, initial_amount - transfer_amount);
        
        println!("✅ Transferred {} tokens successfully!", transfer_amount);
        println!("   Sender balance: {}", sender_data.amount);
        println!("   Recipient balance: {}", recipient_data.amount);
    }
    
    // ========================================================================
    // TEST 5: Approve Delegate - Allow Others to Spend Your Tokens
    // ========================================================================
    // Approval allows another account to spend tokens on your behalf
    // This is useful for smart contracts and automated trading
    
    #[ignore] // Remove this to run the test
    #[test]
    #[serial]
    fn test_approve() {
        init_logging();
        
        let client = ArchRpcClient::new(NODE1_ADDRESS);
        
        let (authority_keypair, authority_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&authority_keypair, BITCOIN_NETWORK);
        
        let (delegate_keypair, delegate_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&delegate_keypair, BITCOIN_NETWORK);
        
        // TODO: Set up mint and accounts
        let (_, token_mint_pubkey) = 
            initialize_mint_token(&client, authority_pubkey, authority_keypair, None);
        let (_, authority_token_account_pubkey) = 
            initialize_token_account(&client, token_mint_pubkey, authority_keypair);
        let (_, delegate_token_account_pubkey) = 
            initialize_token_account(&client, token_mint_pubkey, delegate_keypair);
        
        // TODO: Mint tokens to approve from
        mint_tokens(
            &client,
            &token_mint_pubkey,
            &authority_token_account_pubkey,
            &authority_pubkey,
            authority_keypair,
            1000,
        );
        
        // TODO: Approve delegate to spend tokens
        let approve_amount = 500;
        let approve_instruction = TokenInstruction::Approve { amount: approve_amount };
        let instruction_data = approve_instruction.try_to_vec().unwrap();
        
        let transaction = build_and_sign_transaction(
            ArchMessage::new(
                &[/* TODO: Add your instruction */],
                Some(authority_pubkey),
                client.get_best_block_hash().unwrap(),
            ),
            vec![authority_keypair],
            BITCOIN_NETWORK,
        );
        
        let processed_transactions = send_transactions_and_wait(vec![transaction]);
        assert!(processed_transactions[0].status == Status::Processed);
        
        // TODO: Verify approval was set
        let authority_token_account_info = read_account_info(authority_token_account_pubkey);
        let authority_token_account_data = 
            TokenAccount::try_from_slice(&authority_token_account_info.data).unwrap();
        
        assert_eq!(authority_token_account_data.amount, 1000); // Original balance unchanged
        assert_eq!(authority_token_account_data.delegated_amount, approve_amount);
        assert_eq!(authority_token_account_data.delegate.unwrap(), delegate_token_account_pubkey);
        
        println!("✅ Approved {} tokens for delegate!", approve_amount);
        println!("   Delegate: {}", delegate_token_account_pubkey);
        println!("   Approved amount: {}", authority_token_account_data.delegated_amount);
    }
    
    // ========================================================================
    // TEST 6: Burn Tokens - Remove Tokens from Circulation
    // ========================================================================
    // Burning permanently removes tokens from circulation
    // This reduces the total supply and can increase scarcity
    
    #[ignore] // Remove this to run the test
    #[test]
    #[serial]
    fn test_burn() {
        init_logging();
        
        let client = ArchRpcClient::new(NODE1_ADDRESS);
        
        let (authority_keypair, authority_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&authority_keypair, BITCOIN_NETWORK);
        
        // TODO: Set up mint and account
        let (_, token_mint_pubkey) = 
            initialize_mint_token(&client, authority_pubkey, authority_keypair, None);
        let (_, authority_token_account_pubkey) = 
            initialize_token_account(&client, token_mint_pubkey, authority_keypair);
        
        // TODO: Mint tokens to burn
        let initial_amount = 1000;
        mint_tokens(
            &client,
            &token_mint_pubkey,
            &authority_token_account_pubkey,
            &authority_pubkey,
            authority_keypair,
            initial_amount,
        );
        
        // TODO: Burn some tokens
        let burn_amount = 300;
        let burn_instruction = TokenInstruction::Burn { amount: burn_amount };
        let instruction_data = burn_instruction.try_to_vec().unwrap();
        
        let transaction = build_and_sign_transaction(
            ArchMessage::new(
                &[/* TODO: Add your instruction */],
                Some(authority_pubkey),
                client.get_best_block_hash().unwrap(),
            ),
            vec![authority_keypair],
            BITCOIN_NETWORK,
        );
        
        let processed_tx = send_transactions_and_wait(vec![transaction]);
        assert_eq!(processed_tx[0].status, Status::Processed);
        
        // TODO: Verify tokens were burned
        let authority_token_account_info = read_account_info(authority_token_account_pubkey);
        let authority_token_account_data = 
            TokenAccount::try_from_slice(&authority_token_account_info.data).unwrap();
        
        let mint_info = read_account_info(token_mint_pubkey);
        let mint_data = Mint::try_from_slice(&mint_info.data).unwrap();
        
        assert_eq!(authority_token_account_data.amount, initial_amount - burn_amount);
        assert_eq!(mint_data.supply, initial_amount - burn_amount);
        
        println!("✅ Burned {} tokens successfully!", burn_amount);
        println!("   Remaining balance: {}", authority_token_account_data.amount);
        println!("   Total supply: {}", mint_data.supply);
    }
    
    // ========================================================================
    // TEST 7: Freeze Account - Prevent Token Transfers
    // ========================================================================
    // Freezing prevents all token operations on an account
    // Useful for compliance and security purposes
    
    #[ignore] // Remove this to run the test
    #[test]
    #[serial]
    fn test_freeze_account() {
        init_logging();
        
        let client = ArchRpcClient::new(NODE1_ADDRESS);
        
        let (authority_keypair, authority_pubkey, _) = generate_new_keypair(BITCOIN_NETWORK);
        create_and_fund_account_with_faucet(&authority_keypair, BITCOIN_NETWORK);
        
        // TODO: Create mint with freeze authority
        let (_, token_mint_pubkey) = initialize_mint_token(
            &client,
            authority_pubkey,
            authority_keypair,
            Some(&authority_pubkey), // Set freeze authority
        );
        
        let (_, authority_token_account_pubkey) = 
            initialize_token_account(&client, token_mint_pubkey, authority_keypair);
        
        mint_tokens(
            &client,
            &token_mint_pubkey,
            &authority_token_account_pubkey,
            &authority_pubkey,
            authority_keypair,
            1000,
        );
        
        // TODO: Freeze the account
        let freeze_instruction = TokenInstruction::FreezeAccount;
        let instruction_data = freeze_instruction.try_to_vec().unwrap();
        
        let transaction = build_and_sign_transaction(
            ArchMessage::new(
                &[/* TODO: Add your instruction */],
                Some(authority_pubkey),
                client.get_best_block_hash().unwrap(),
            ),
            vec![authority_keypair],
            BITCOIN_NETWORK,
        );
        
        let processed_tx = send_transactions_and_wait(vec![transaction]);
        assert_eq!(processed_tx[0].status, Status::Processed);
        
        // TODO: Verify account is frozen
        let token_account_info = read_account_info(authority_token_account_pubkey);
        let token_account_data = 
            TokenAccount::try_from_slice(&token_account_info.data).unwrap();
        assert_eq!(token_account_data.state, AccountState::Frozen);
        
        println!("✅ Account frozen successfully!");
        println!("   Account state: {:?}", token_account_data.state);
    }
    
    // ========================================================================
    // HELPER FUNCTIONS - Reusable Code for Tests
    // ========================================================================
    // These functions help reduce code duplication in tests
    // Study them to understand common patterns
    
    fn create_account_helper(
        client: &ArchRpcClient,
        payer: &Pubkey,
        new_account: &Pubkey,
        payer_keypair: /* TODO: Add type */,
        new_account_keypair: /* TODO: Add type */,
        space: u64,
    ) {
        // TODO: Implement account creation helper
        // This should create a new account with the specified space
        // Use system_instruction::create_account
    }
    
    fn initialize_mint_token(
        client: &ArchRpcClient,
        authority: Pubkey,
        authority_keypair: /* TODO: Add type */,
        freeze_authority: Option<&Pubkey>,
    ) -> (/* TODO: Return type */, Pubkey) {
        // TODO: Implement mint initialization helper
        // This should create and initialize a new mint
        // Return the mint keypair and pubkey
    }
    
    fn initialize_token_account(
        client: &ArchRpcClient,
        mint: Pubkey,
        owner_keypair: /* TODO: Add type */,
    ) -> (/* TODO: Return type */, Pubkey) {
        // TODO: Implement token account initialization helper
        // This should create and initialize a new token account
        // Return the account keypair and pubkey
    }
    
    fn mint_tokens(
        client: &ArchRpcClient,
        mint: &Pubkey,
        destination: &Pubkey,
        authority: &Pubkey,
        authority_keypair: /* TODO: Add type */,
        amount: u64,
    ) {
        // TODO: Implement token minting helper
        // This should mint tokens to the specified account
    }
    
    // ========================================================================
    // ADVANCED CHALLENGES - For Experienced Students
    // ========================================================================
    // Try implementing these additional features:
    
    // TODO: Implement multisig token operations
    // TODO: Add associated token account creation
    // TODO: Create a token swap function
    // TODO: Implement token metadata
    // TODO: Add governance token features
    
    // BONUS: Create a simple DEX (Decentralized Exchange) using these primitives!
} 