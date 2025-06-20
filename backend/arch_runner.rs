use std::fs;
use std::path::Path;
use std::process::Command;
use tempfile::TempDir;
use tracing::{info, error};

pub async fn compile_and_run(code: &str) -> Result<String, String> {
    info!("Creating temporary directory for Arch program");
    
    // Create a temporary directory
    let temp_dir = TempDir::new().map_err(|e| format!("Failed to create temp directory: {}", e))?;
    let temp_path = temp_dir.path();
    
    // Create Cargo.toml for the Arch program
    let cargo_toml = r#"[package]
name = "temp_arch_program"
version = "0.1.0"
edition = "2021"

[dependencies]
arch-program = "0.1.0"

[lib]
crate-type = ["cdylib"]
"#;
    
    let cargo_toml_path = temp_path.join("Cargo.toml");
    fs::write(&cargo_toml_path, cargo_toml)
        .map_err(|e| format!("Failed to write Cargo.toml: {}", e))?;
    
    // Create src directory and lib.rs
    let src_dir = temp_path.join("src");
    fs::create_dir(&src_dir)
        .map_err(|e| format!("Failed to create src directory: {}", e))?;
    
    let lib_path = src_dir.join("lib.rs");
    fs::write(&lib_path, code)
        .map_err(|e| format!("Failed to write lib.rs: {}", e))?;
    
    info!("Compiling Arch program");
    
    // Try to compile the program
    let compile_output = Command::new("cargo")
        .args(&["check", "--lib"])
        .current_dir(temp_path)
        .output()
        .map_err(|e| format!("Failed to execute cargo: {}", e))?;
    
    if !compile_output.status.success() {
        let stderr = String::from_utf8_lossy(&compile_output.stderr);
        return Err(format!("Compilation failed:\n{}", stderr));
    }
    
    // For now, we'll simulate running the program by analyzing the code
    // In a real implementation, you'd want to use a proper Arch runtime
    let output = simulate_arch_execution(code)?;
    
    info!("Arch program executed successfully");
    Ok(output)
}

fn simulate_arch_execution(code: &str) -> Result<String, String> {
    let mut output = String::new();
    
    // Look for msg! macro calls and extract the messages
    for line in code.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("msg!(") {
            // Extract the message from msg!("Hello, Arch World!");
            if let Some(start) = trimmed.find('"') {
                if let Some(end) = trimmed.rfind('"') {
                    if start < end {
                        let message = &trimmed[start + 1..end];
                        output.push_str(&format!("Program log: {}\n", message));
                    }
                }
            }
        }
    }
    
    if output.is_empty() {
        output.push_str("Program executed successfully (no output)\n");
    }
    
    output.push_str("Program completed successfully\n");
    Ok(output)
} 