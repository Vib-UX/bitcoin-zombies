# 🪙 Token Operations Lesson - Arch Network

Welcome to the comprehensive Token Operations lesson for Arch Network! This lesson will teach you how to build, test, and interact with token programs on Arch Network using real-world examples.

## 🎯 Learning Objectives

By completing this lesson, you will learn how to:

- ✅ Initialize token mints and create new token types
- ✅ Create and manage token accounts (wallets)
- ✅ Mint new tokens and control token supply
- ✅ Transfer tokens between accounts securely
- ✅ Implement approval/delegate mechanisms for DeFi
- ✅ Burn tokens to reduce supply
- ✅ Freeze/thaw accounts for compliance
- ✅ Build comprehensive test suites for token programs

## 🛠️ Prerequisites

Before starting this lesson, make sure you have:

- Basic understanding of Rust programming
- Familiarity with blockchain concepts
- Completed the "Hello World" and "Account Management" lessons
- Arch Network development environment set up

## 📁 Project Structure

```
token_operations/
├── Cargo.toml          # Project dependencies and configuration
├── src/
│   └── lib.rs          # Main token program implementation
├── tests/
│   └── integration_tests.rs  # Interactive test suite
└── README.md           # This file
```

## 🚀 Getting Started

### 1. Clone and Setup

```bash
cd arch-lessons/token_operations
cargo build
```

### 2. Understanding the Code Structure

The lesson is organized into several key components:

#### **Token Program (`src/lib.rs`)**

- `TokenInstruction` enum - Defines all supported operations
- `Mint` struct - Represents token mint accounts
- `TokenAccount` struct - Represents user token accounts
- `AccountState` enum - Tracks account status (initialized, frozen, etc.)

#### **Interactive Tests (`tests/integration_tests.rs`)**

- 7 comprehensive test scenarios
- Each test focuses on a specific token operation
- Includes TODO items for hands-on learning
- Helper functions to reduce code duplication

### 3. Running the Tests

Each test is marked with `#[ignore]` initially. To run a specific test:

```bash
# Run a specific test (remove #[ignore] first)
cargo test test_initialize_mint -- --nocapture

# Run all tests (after completing TODOs)
cargo test -- --nocapture
```

## 📚 Lesson Walkthrough

### Test 1: Initialize Mint 🏭

**What you'll learn:** How to create a new token type

```rust
// Creates a "token factory" that can mint new tokens
TokenInstruction::InitializeMint { decimals: 9 }
```

**Key concepts:**

- Mint authority controls who can create tokens
- Decimals determine token precision (like Bitcoin's 8 decimals)
- Freeze authority can freeze/unfreeze accounts

### Test 2: Initialize Token Account 👛

**What you'll learn:** How to create wallets for specific tokens

```rust
// Creates a wallet that can hold tokens from a specific mint
TokenInstruction::InitializeAccount
```

**Key concepts:**

- Each token account is tied to one mint and one owner
- Accounts start with zero balance
- Account state tracking (initialized, frozen, etc.)

### Test 3: Mint Tokens 🪙

**What you'll learn:** How to create new tokens

```rust
// Creates new tokens and adds them to circulation
TokenInstruction::MintTo { amount: 1000 }
```

**Key concepts:**

- Only mint authority can mint tokens
- Minting increases total supply
- Overflow protection with checked arithmetic

### Test 4: Transfer Tokens 💸

**What you'll learn:** How to send tokens between accounts

```rust
// Moves tokens from one account to another
TokenInstruction::Transfer { amount: 250 }
```

**Key concepts:**

- Sender must have sufficient balance
- Both accounts must use the same mint
- Supports owner and delegate transfers

### Test 5: Approve Delegate 🤝

**What you'll learn:** How to allow others to spend your tokens

```rust
// Allows another account to spend tokens on your behalf
TokenInstruction::Approve { amount: 500 }
```

**Key concepts:**

- Enables DeFi protocols and smart contracts
- Delegate can spend up to approved amount
- Owner can revoke approval at any time

### Test 6: Burn Tokens 🔥

**What you'll learn:** How to permanently remove tokens

```rust
// Removes tokens from circulation permanently
TokenInstruction::Burn { amount: 300 }
```

**Key concepts:**

- Reduces total supply
- Cannot be reversed
- Often used for deflationary tokenomics

### Test 7: Freeze Account ❄️

**What you'll learn:** How to prevent token operations

```rust
// Prevents all token operations on an account
TokenInstruction::FreezeAccount
```

**Key concepts:**

- Useful for compliance and security
- Only freeze authority can freeze/thaw
- Completely disables account operations

## 🎓 Interactive Learning

### Completing the TODOs

Each test contains TODO items that you need to complete:

1. **Read the comments** - Understand what each section does
2. **Fill in the TODOs** - Complete the missing code
3. **Run the test** - Remove `#[ignore]` and run `cargo test`
4. **Verify success** - Make sure the test passes
5. **Understand the output** - Read the success messages

### Example TODO Completion

```rust
// Before (TODO)
let transaction = build_and_sign_transaction(
    ArchMessage::new(
        &[/* TODO: Add your instruction here */],
        Some(authority_pubkey),
        client.get_best_block_hash().unwrap(),
    ),
    vec![authority_keypair, token_mint_keypair],
    BITCOIN_NETWORK,
);

// After (Completed)
let transaction = build_and_sign_transaction(
    ArchMessage::new(
        &[create_instruction(
            &program_id,
            &[mint_info.key, authority_info.key],
            instruction_data,
        )],
        Some(authority_pubkey),
        client.get_best_block_hash().unwrap(),
    ),
    vec![authority_keypair, token_mint_keypair],
    BITCOIN_NETWORK,
);
```

## 🏆 Advanced Challenges

Once you complete the basic tests, try these advanced challenges:

### 1. Multisig Token Operations

Implement token operations that require multiple signatures.

### 2. Associated Token Accounts

Create token accounts using deterministic addresses.

### 3. Token Swap Function

Build a simple token exchange mechanism.

### 4. Token Metadata

Add name, symbol, and description to your tokens.

### 5. Governance Tokens

Implement voting and proposal mechanisms.

### 6. Simple DEX

Build a decentralized exchange using these token primitives!

## 🔧 Troubleshooting

### Common Issues

**Test fails with "InvalidAccountData"**

- Check that account sizes match the struct definitions
- Verify accounts are created before initialization

**"MissingRequiredSignature" error**

- Ensure all required signers are included in the transaction
- Check that the correct keypairs are used

**"InsufficientFunds" error**

- Verify account has enough tokens for the operation
- Check that tokens were minted successfully

**"InvalidArgument" error**

- Verify account ownership and authorities
- Check that accounts belong to the correct mint

### Debug Tips

1. **Add logging** - Use `println!` to debug values
2. **Check account data** - Verify account contents after operations
3. **Test incrementally** - Complete one TODO at a time
4. **Read error messages** - Arch provides detailed error information

## 📖 Additional Resources

- [Arch Network Documentation](https://github.com/Arch-Network/book)
- [Arch Examples Repository](https://github.com/Arch-Network/arch-examples)
- [Arch CLI Tools](https://github.com/Arch-Network/arch-cli)
- [Token Program Specification](https://spl.solana.com/token) (Similar patterns)

## 🎉 Completion

Congratulations! By completing this lesson, you've learned:

- ✅ How to build comprehensive token programs
- ✅ Real-world token operation patterns
- ✅ Testing and validation techniques
- ✅ Security considerations for token programs
- ✅ DeFi building blocks and primitives

You're now ready to build sophisticated DeFi applications on Arch Network!

## 🤝 Contributing

Found an issue or want to improve the lesson?

1. Fork the repository
2. Make your changes
3. Submit a pull request
4. Help other students learn!

---

**Happy coding on Arch Network! 🚀**
