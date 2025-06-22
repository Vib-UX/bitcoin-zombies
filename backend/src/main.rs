use axum::{
    extract::Json,
    http::StatusCode,
    response::Json as ResponseJson,
    routing::post,
    Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing::{info, error};

mod arch_runner;

#[derive(Deserialize)]
struct RunCodeRequest {
    code: String,
}

#[derive(Serialize)]
struct RunCodeResponse {
    output: Option<String>,
    error: Option<String>,
    success: bool,
}

async fn run_arch_code(Json(request): Json<RunCodeRequest>) -> Result<ResponseJson<RunCodeResponse>, StatusCode> {
    info!("Received code execution request");
    
    match arch_runner::compile_and_run(&request.code).await {
        Ok(output) => {
            info!("Code executed successfully");
            Ok(ResponseJson(RunCodeResponse {
                output: Some(output),
                error: None,
                success: true,
            }))
        }
        Err(err) => {
            error!("Code execution failed: {}", err);
            Ok(ResponseJson(RunCodeResponse {
                output: None,
                error: Some(err),
                success: false,
            }))
        }
    }
}

async fn health_check() -> &'static str {
    "Bitcoin Zombies Backend is running!"
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    // Build our application with routes
    let app = Router::new()
        .route("/api/run-arch", post(run_arch_code))
        .route("/health", axum::routing::get(health_check))
        .layer(CorsLayer::permissive());

    // Run the server
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    info!("Starting server on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
} 