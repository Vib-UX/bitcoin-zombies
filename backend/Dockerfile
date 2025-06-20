# Use the official Rust image as base
FROM rust:1.75

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Cargo files
COPY Cargo.toml ./
COPY src/ ./src/

# Build the application
RUN cargo build --release

# Expose the port
EXPOSE 8080

# Run the application
CMD ["./target/release/bitcoin-zombies-backend"] 